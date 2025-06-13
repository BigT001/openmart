'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Input } from '../ui/input'
import { Button } from '../ui/button'

interface SearchInputProps {
  prompt: string
  isSearching: boolean
  onPromptChange: (value: string) => void
  onSubmit: (e: React.FormEvent) => void
}

export const SearchInput: React.FC<SearchInputProps> = ({
  prompt,
  isSearching,
  onPromptChange,
  onSubmit
}) => {
  return (
    <motion.form 
      onSubmit={onSubmit}
      className="relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative flex items-center">
        <Input
          type="text"
          placeholder="Describe what you want (e.g., iPhone 13 under 500k, Red Nike sneakers...)"
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          className="w-full h-16 pl-6 pr-36 text-lg rounded-xl border border-gray-200 
                    dark:border-gray-800 focus:border-indigo-500 dark:focus:border-indigo-500 
                    bg-white dark:bg-gray-900 shadow-lg transition-all duration-200
                    focus:ring-2 focus:ring-indigo-500/20"
          aria-label="Search input"
          autoComplete="off"
        />
        <div className="absolute right-3">
          <Button
            type="submit"
            disabled={isSearching || !prompt.trim()}
            className={`h-12 px-8 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 
                       text-white font-medium text-lg hover:from-indigo-700 hover:to-purple-700 
                       transition-all duration-300 shadow-lg hover:shadow-indigo-500/25 
                       flex items-center gap-2 ${isSearching ? 'opacity-90' : ''}`}
            aria-label={isSearching ? 'Searching...' : 'Search'}
          >
            {isSearching ? (
              <div className="flex items-center gap-2">
                <motion.div
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <span>Searching...</span>
              </div>
            ) : (
              <span>Search</span>
            )}
          </Button>
        </div>
      </div>
    </motion.form>
  )
}
