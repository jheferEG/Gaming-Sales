/**
 * useEngineSound — sonido de carrera con Web Audio API.
 * No requiere archivos externos.  La API de Audio sólo puede iniciarse
 * tras un gesto del usuario, así que se activa cuando el usuario
 * pulsa el botón de sonido en el header.
 *
 * Exports:
 *  - toggleSound(enabled) — activa / desactiva el motor
 *  - revUp()              — rugido al ganar un deal
 *  - celebrate()          — fanfara al alcanzar la meta
 *  - soundOn              — estado actual
 */
import { useRef, useState, useCallback } from 'react'

export function useEngineSound() {
  const ctxRef    = useRef(null)
  const engineRef = useRef(null) // { oscs, lfo, masterGain }
  const [soundOn, setSoundOn] = useState(false)

  // ── build or get AudioContext ─────────────────────
  function getCtx() {
    if (!ctxRef.current) {
      ctxRef.current = new (window.AudioContext || window.webkitAudioContext)()
    }
    if (ctxRef.current.state === 'suspended') ctxRef.current.resume()
    return ctxRef.current
  }

  // ── construct the idle engine graph ──────────────
  function buildEngine(ctx) {
    if (engineRef.current) return

    // LFO simula el ciclo de pistones (6 Hz = ralentí)
    const lfo = ctx.createOscillator()
    const lfoGain = ctx.createGain()
    lfo.type = 'sine'
    lfo.frequency.value = 6
    lfoGain.gain.value = 10
    lfo.connect(lfoGain)

    // Master gain
    const masterGain = ctx.createGain()
    masterGain.gain.value = 0
    masterGain.connect(ctx.destination)

    // 3 osciladores para armónicos de motor
    const config = [
      { type: 'sawtooth', freq: 58,  vol: 0.50 },
      { type: 'square',   freq: 116, vol: 0.28 },
      { type: 'sawtooth', freq: 174, vol: 0.14 },
    ]
    const oscs = config.map(({ type, freq, vol }) => {
      const osc = ctx.createOscillator()
      const g   = ctx.createGain()
      osc.type = type
      osc.frequency.value = freq
      g.gain.value = vol
      lfoGain.connect(osc.frequency) // LFO modula pitch ligeramente
      osc.connect(g)
      g.connect(masterGain)
      osc.start()
      return { osc, g, baseFreq: freq }
    })

    lfo.start()
    engineRef.current = { oscs, lfo, lfoGain, masterGain }
  }

  // ── toggle on/off ─────────────────────────────────
  const toggleSound = useCallback((on) => {
    const ctx = getCtx()
    buildEngine(ctx)
    const { masterGain } = engineRef.current
    const t = ctx.currentTime

    if (on) {
      masterGain.gain.cancelScheduledValues(t)
      masterGain.gain.setValueAtTime(0, t)
      masterGain.gain.linearRampToValueAtTime(0.038, t + 0.6)
      setSoundOn(true)
    } else {
      masterGain.gain.cancelScheduledValues(t)
      masterGain.gain.setValueAtTime(masterGain.gain.value, t)
      masterGain.gain.linearRampToValueAtTime(0, t + 0.4)
      setSoundOn(false)
    }
  }, [])

  // ── rev-up on new deal ────────────────────────────
  const revUp = useCallback(() => {
    if (!engineRef.current || !soundOn) return
    const ctx = ctxRef.current
    const { oscs, masterGain, lfo } = engineRef.current
    const t = ctx.currentTime

    // LFO se acelera (más pistones) y vuelve a ralentí
    lfo.frequency.cancelScheduledValues(t)
    lfo.frequency.setValueAtTime(6, t)
    lfo.frequency.linearRampToValueAtTime(28, t + 0.35)
    lfo.frequency.linearRampToValueAtTime(6,  t + 2.0)

    // Sweep de frecuencia: sube 3× y baja a 1.4×
    oscs.forEach(({ osc, baseFreq }) => {
      osc.frequency.cancelScheduledValues(t)
      osc.frequency.setValueAtTime(baseFreq, t)
      osc.frequency.linearRampToValueAtTime(baseFreq * 3.2, t + 0.38)
      osc.frequency.linearRampToValueAtTime(baseFreq * 1.4, t + 0.85)
      osc.frequency.linearRampToValueAtTime(baseFreq,       t + 2.2)
    })

    // Volumen sube y baja
    masterGain.gain.cancelScheduledValues(t)
    masterGain.gain.setValueAtTime(0.038, t)
    masterGain.gain.linearRampToValueAtTime(0.075, t + 0.38)
    masterGain.gain.linearRampToValueAtTime(0.038, t + 2.2)
  }, [soundOn])

  // ── victory fanfare ───────────────────────────────
  const celebrate = useCallback(() => {
    const ctx = getCtx()
    // C major arpeggio: C5 E5 G5 C6 E6 C6
    const notes = [
      [523.25, 0.00],
      [659.25, 0.17],
      [783.99, 0.34],
      [1046.5, 0.51],
      [1318.5, 0.72],
      [1046.5, 0.90],
    ]
    notes.forEach(([freq, delay]) => {
      const osc = ctx.createOscillator()
      const env = ctx.createGain()
      osc.type = 'triangle'
      osc.frequency.value = freq
      const start = ctx.currentTime + delay
      env.gain.setValueAtTime(0, start)
      env.gain.linearRampToValueAtTime(0.13, start + 0.04)
      env.gain.exponentialRampToValueAtTime(0.001, start + 0.5)
      osc.connect(env)
      env.connect(ctx.destination)
      osc.start(start)
      osc.stop(start + 0.55)
    })

    // Tambores — burst de ruido filtrado (crowd cheer simulado)
    for (let i = 0; i < 3; i++) {
      const buf   = ctx.createBuffer(1, ctx.sampleRate * 0.12, ctx.sampleRate)
      const data  = buf.getChannelData(0)
      for (let j = 0; j < data.length; j++) data[j] = Math.random() * 2 - 1
      const src   = ctx.createBufferSource()
      const bpf   = ctx.createBiquadFilter()
      const envN  = ctx.createGain()
      bpf.type = 'bandpass'
      bpf.frequency.value = 800 + i * 400
      bpf.Q.value = 1.5
      src.buffer = buf
      const t = ctx.currentTime + i * 0.25
      envN.gain.setValueAtTime(0.06, t)
      envN.gain.exponentialRampToValueAtTime(0.001, t + 0.15)
      src.connect(bpf)
      bpf.connect(envN)
      envN.connect(ctx.destination)
      src.start(t)
    }
  }, [])

  return { toggleSound, revUp, celebrate, soundOn }
}
