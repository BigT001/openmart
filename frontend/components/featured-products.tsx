'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Skeleton } from "./ui/skeleton"

interface Product {
  title: string
  price: number
  image: string
  seller: string
  source: string
  post_url: string
}

const FeaturedProductSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
    <Skeleton className="h-64 w-full" />
    <div className="p-6">
      <Skeleton className="h-6 w-3/4 mb-2" />
      <Skeleton className="h-8 w-1/2 mb-4" />
      <div className="flex justify-between items-center">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-6 w-16" />
      </div>
    </div>
  </div>
)

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      damping: 15,
      stiffness: 100
    }
  }
}

const TIMEOUT_DURATION = 30000 // 30 seconds
const MAX_RETRIES = 3
const RETRY_DELAY = 2000 // 2 seconds

const getErrorMessage = (error: any): string => {
  if (error.name === 'AbortError') {
    return 'Request timed out. Please try again.'
  }
  if (error instanceof TypeError && error.message === 'Failed to fetch') {
    return 'Network error. Please check your connection.'
  }
  if (error.status === 404) {
    return 'No products found. Please try again later.'
  }
  return 'Error loading products. Please try again.'
}

export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const [isRetrying, setIsRetrying] = useState(false)

  const fetchWithTimeout = useCallback(async (
    url: string,
    options: RequestInit = {},
    timeout = TIMEOUT_DURATION
  ) => {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } finally {
      clearTimeout(timeoutId)
    }
  }, [])

  const fetchFeaturedProducts = useCallback(async () => {
    try {
      if (!isRetrying) {
        setLoading(true)
      }
      setError(null)

      const data = await fetchWithTimeout('/api/products/featured')
      
      if (!data || !Array.isArray(data) || data.length === 0) {
        throw new Error('No products found')
      }

      setProducts(data)
      setRetryCount(0)
      setIsRetrying(false)
    } catch (err: any) {
      console.error('Error fetching featured products:', err)
      
      if (retryCount < MAX_RETRIES) {
        setRetryCount(prev => prev + 1)
        setIsRetrying(true)
        setError(`Retrying... (Attempt ${retryCount + 1} of ${MAX_RETRIES})`)
        
        // Retry after delay
        setTimeout(() => {
          fetchFeaturedProducts()
        }, RETRY_DELAY)
      } else {
        setIsRetrying(false)
        setError(getErrorMessage(err))
      }
    } finally {
      if (!isRetrying) {
        setLoading(false)
      }
    }
  }, [fetchWithTimeout, retryCount, isRetrying])

  useEffect(() => {
    fetchFeaturedProducts()
  }, [fetchFeaturedProducts])

  const handleRetry = () => {
    setRetryCount(0)
    setIsRetrying(false)
    fetchFeaturedProducts()
  }

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Trending Now
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Discover trending products from Instagram vendors
          </p>
        </motion.div>

        {error && (
          <div className="text-center mb-8">
            <p className="text-red-500">{error}</p>
            {retryCount >= MAX_RETRIES && !isRetrying && (
              <button
                onClick={handleRetry}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-200"
              >
                Try Again
              </button>
            )}
          </div>
        )}

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {loading ? (
            <>
              {[...Array(4)].map((_, i) => (
                <FeaturedProductSkeleton key={i} />
              ))}
            </>
          ) : (
            products.map((product, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <a href={product.post_url} target="_blank" rel="noopener noreferrer">
                  <div className="relative h-64 w-full">
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      priority
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white truncate">
                      {product.title}
                    </h3>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                        ₦{product.price.toLocaleString()}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {product.seller}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 text-sm px-3 py-1 rounded-full">
                        {product.source}
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        View on Instagram
                      </span>
                    </div>
                  </div>
                </a>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>
    </section>
  )
}
