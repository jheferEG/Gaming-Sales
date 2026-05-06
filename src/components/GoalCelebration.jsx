import { useEffect, useState } from 'react'
import Confetti from 'react-confetti'
import { motion, AnimatePresence } from 'framer-motion'

export default function GoalCelebration({ agent, onDismiss }) {
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight })

  useEffect(() => {
    const handler = () =>
      setWindowSize({ width: window.innerWidth, height: window.innerHeight })
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  useEffect(() => {
    if (agent) {
      const t = setTimeout(onDismiss, 5000)
      return () => clearTimeout(t)
    }
  }, [agent, onDismiss])

  return (
    <AnimatePresence>
      {agent && (
        <>
          <Confetti
            width={windowSize.width}
            height={windowSize.height}
            recycle={false}
            numberOfPieces={320}
            colors={['#A855F7', '#06B6D4', '#10B981', '#F97316', '#facc15', '#fff']}
            style={{ position: 'fixed', top: 0, left: 0, zIndex: 100, pointerEvents: 'none' }}
          />
          <motion.div
            key="celebration"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={onDismiss}
          >
            <motion.div
              initial={{ scale: 0.5, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.5, y: 40 }}
              transition={{ type: 'spring', bounce: 0.5 }}
              className="text-center p-10 rounded-3xl"
              style={{
                background: 'linear-gradient(135deg, #0D1422 0%, #111827 100%)',
                border: '1px solid rgba(255,255,255,0.12)',
                boxShadow: '0 0 80px rgba(250,204,21,0.3)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                animate={{ rotate: [0, -10, 10, -6, 6, 0], scale: [1, 1.15, 1] }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-8xl mb-4"
              >
                🏆
              </motion.div>
              <h2 className="font-orbitron font-black text-3xl text-yellow-400 mb-2 tracking-wide">
                ¡META ALCANZADA!
              </h2>
              <p className="font-rajdhani text-2xl font-semibold text-white mb-1">{agent.name}</p>
              <p className="font-rajdhani text-white/50 text-lg mb-6">
                {agent.deals} deals — objetivo cumplido 🎯
              </p>
              <motion.button
                onClick={onDismiss}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="px-8 py-3 rounded-xl bg-yellow-400 text-black font-orbitron font-bold text-sm tracking-wide"
              >
                CONTINUAR
              </motion.button>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
