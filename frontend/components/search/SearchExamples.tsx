'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface SearchExamplesProps {
  onExampleClick: (query: string) => void
}

export const SearchExamples: React.FC<SearchExamplesProps> = ({ onExampleClick }) => {
  const exampleQueries = [
    "iPhone 13 under 500K",
    "Red heels in Lagos",
    "PS5 console used",
    "Nike Air Jordan"
  ]

  return (
    <motion.div 
      className="mt-4 flex flex-wrap gap-2 justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
    >
      <span className="text-sm text-gray-500 dark:text-gray-400">Popular searches:</span>
      {exampleQueries.map((query, i) => (
        <motion.button
          key={query}
          onClick={() => onExampleClick(query)}
          className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 text-sm"
          whileHover={{ scale: 1.05 }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 0.2,
            delay: 0.5 + i * 0.1
          }}
          aria-label={`Search for ${query}`}
        >
          "{query}"
        </motion.button>
      ))}
    </motion.div>
  )
}
