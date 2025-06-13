'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface SearchErrorProps {
  error: string | null
}

export const SearchError: React.FC<SearchErrorProps> = ({ error }) => {
  return (
    <AnimatePresence>
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute mt-2 text-red-500 text-sm"
        >
          {error}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
