'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { SearchForm } from '@/components/search'
import { HowItWorks } from '@/components/how-it-works'
import { FeaturedProducts } from '@/components/featured-products'
import { TrustedVendors } from '@/components/trusted-vendors'
import { Navbar } from "@/components/navbar"
import { motion } from "framer-motion"
import { useRef } from 'react'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
      duration: 0.8,
      ease: [0.04, 0.62, 0.23, 0.98]
    }
  }
}

const titleVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1.2,
      ease: [0.04, 0.62, 0.23, 0.98]
    }
  }
}

const searchVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: [0.04, 0.62, 0.23, 0.98],
      delay: 0.4
    }
  }
}

export default function Home() {
  const searchFormRef = useRef<{ setPrompt: (query: string) => void }>(null)
  const router = useRouter()

  useEffect(() => {
    // Remove forced redirect to /auth so landing page is always visible
    // Auth logic can be handled elsewhere (e.g., dashboard route protection)
  }, [])

  const handleExampleClick = (query: string) => {
    if (searchFormRef.current) {
      searchFormRef.current.setPrompt(query)
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 pt-16">
        {/* Hero Section with Search */}
        <section className="relative py-20 bg-gradient-to-b from-indigo-50 to-white dark:from-gray-900 dark:to-gray-950">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <motion.div
                className="space-y-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.h1 
                  className="text-6xl md:text-7xl font-extrabold mb-6 tracking-tight"
                  variants={titleVariants}
                >
                  <span className="block bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Find Anything,
                  </span>
                  <span className="block bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                    Buy Smart
                  </span>
                </motion.h1>
                <motion.p 
                  className="text-2xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-12 leading-relaxed font-medium"
                  variants={titleVariants}
                >
                  Let our AI assistant help you discover the best deals from trusted vendors
                </motion.p>
              </motion.div>
              <motion.div 
                className="w-full max-w-4xl mx-auto relative z-10"
                variants={searchVariants}
              >
                {/* Animated Gradient Border */}
                <motion.div 
                  className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl blur-lg opacity-75"
                  animate={{ 
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{ 
                    duration: 5,
                    ease: "linear",
                    repeat: Infinity
                  }}
                />
                
                {/* Search Container */}
                <div className="relative bg-white dark:bg-gray-900 rounded-lg shadow-2xl p-6 backdrop-blur-sm border border-gray-200 dark:border-gray-800">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                      What are you looking for?
                    </h2>
                    
                    {/* Search Form */}
                    <div className="relative">
                      <SearchForm ref={searchFormRef} />
                    </div>

                    {/* Example Searches */}
                    <motion.div 
                      className="mt-6 flex flex-wrap items-center gap-3 text-sm text-gray-500"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 1, delay: 0.5 }}
                    >
                      <span className="font-medium">Popular searches:</span>
                      {[
                        "iPhone 13 under 500K",
                        "Red heels in Lagos",
                        "PS5 console",
                        "Nike Air Max"
                      ].map((text, i) => (
                        <motion.button
                          key={text}
                          onClick={() => handleExampleClick(text)}
                          className="px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 
                                   hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-colors duration-200
                                   font-medium cursor-pointer"
                          whileHover={{ 
                            scale: 1.05,
                            transition: { duration: 0.2 }
                          }}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.7 + i * 0.1 }}
                        >
                          {text}
                        </motion.button>
                      ))}
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
          
          {/* Background Pattern */}
          <div className="absolute inset-0 z-0 opacity-30 dark:opacity-20">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle at 25px 25px, rgba(99, 102, 241, 0.15) 2%, transparent 0%)',
              backgroundSize: '50px 50px'
            }} />
          </div>
        </section>


        {/* Featured Products */}
        <FeaturedProducts />

       
      </main>
    </div>
  )
}
