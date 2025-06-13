'use client'

import React, { useState, forwardRef, useImperativeHandle } from 'react'
import { motion } from 'framer-motion'
import { SearchInput } from './SearchInput'
import { SearchError } from './SearchError'
import { SearchExamples } from './SearchExamples'

interface SearchResult {
  title: string
  image: string
  seller: string
  source: string
  post_url: string
  price: number
  add_to_cart: boolean
}

interface SearchFormProps {
  className?: string
}

interface SearchFormRef {
  setPrompt: (query: string) => void
}

export const SearchForm = forwardRef<SearchFormRef, SearchFormProps>((props, ref) => {
  const [prompt, setPrompt] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [results, setResults] = useState<SearchResult[]>([])
  const [error, setError] = useState<string | null>(null)

  useImperativeHandle(ref, () => ({
    setPrompt: (query: string) => {
      setPrompt(query)
    }
  }))

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSearching(true)
    setError(null)
    setResults([])

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000)

    try {
      const response = await fetch('http://localhost:8000/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ prompt }),
        signal: controller.signal
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Search failed. Please try again.')
      }
      
      const data = await response.json()
      setResults(data)
    } catch (error) {
      console.error('Search error:', error)
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          setError('Search timed out. Please try again.')
        } else {
          setError(error.message)
        }
      } else {
        setError('An unexpected error occurred. Please try again.')
      }
    } finally {
      setIsSearching(false)
      clearTimeout(timeoutId)
    }
  }

  const handleExampleClick = (exampleQuery: string) => {
    setPrompt(exampleQuery)
    handleSearch({ preventDefault: () => {} } as React.FormEvent)
  }

  return (
    <div className="w-full mx-auto">
      <SearchInput
        prompt={prompt}
        isSearching={isSearching}
        onPromptChange={setPrompt}
        onSubmit={handleSearch}
      />
      <SearchError error={error} />
      {results.length > 0 && (
        <motion.div
          className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {results.map((result, index) => (
            <motion.div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden 
                       hover:shadow-xl transition-shadow duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="aspect-w-16 aspect-h-9">
                <img 
                  src={result.image} 
                  alt={result.title}
                  className="w-full h-48 object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2 
                           line-clamp-2 hover:line-clamp-none">
                  {result.title}
                </h3>
                <p className="text-indigo-600 dark:text-indigo-400 font-bold text-xl mb-2">
                  ₦{result.price.toLocaleString()}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {result.seller}
                  </span>
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    via {result.source}
                  </span>
                </div>
                <a
                  href={result.post_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 block w-full text-center py-2 px-4 bg-indigo-600 
                         hover:bg-indigo-700 text-white rounded-lg transition-colors duration-200"
                >
                  View Details
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
})
