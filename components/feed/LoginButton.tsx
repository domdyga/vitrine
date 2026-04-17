'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function LoginButton() {
  return (
    <motion.div
      className="fixed top-4 right-4 z-30"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.4 }}
    >
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Link
          href="/login"
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-light tracking-widest uppercase hover:bg-white/20 transition-colors"
        >
          Connexion
        </Link>
      </motion.div>
    </motion.div>
  )
}
