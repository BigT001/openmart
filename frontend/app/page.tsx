'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { SearchForm } from '@/components/search'
import { FeaturedProducts } from '@/components/featured-products/featured-products'
import { Navbar } from "@/components/navbar/navbar"
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

import { easeInOut } from "framer-motion"

const searchVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: easeInOut,
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
        <section className="relative py-20 min-h-[60vh] bg-gradient-to-br from-white via-[#f5f5fa] to-[#e5e7eb] dark:from-[#232136] dark:to-[#181818]">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <div className="space-y-8">
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4 text-[#232136] drop-shadow-lg">
                  OpenMart
                </h1>
                <p className="text-lg md:text-xl font-medium max-w-2xl mx-auto mb-6 leading-relaxed text-[#44446a]">
                  Your AI-powered marketplace for <span className="text-[#7c3aed] font-semibold">trusted vendors</span>, <span className="text-[#b39ddb] font-semibold">best deals</span>, and a seamless shopping experience.
                </p>
              </div>
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
                <div className="relative bg-[#181818] dark:bg-[#181818] rounded-2xl shadow-2xl p-6 backdrop-blur-sm border border-[#232136]">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <h2 className="text-2xl font-bold text-[#b39ddb] mb-4 tracking-wide">
                      What are you looking for today?
                    </h2>
                    
                    {/* Search Form */}
                    <div className="relative">
                      <SearchForm ref={searchFormRef} />
                    </div>

                    {/* Example Searches */}
                    <motion.div 
                      className="mt-6 flex flex-wrap items-center gap-3 text-sm text-[#b39ddb]"
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
                          className="px-4 py-2 rounded-full bg-[#232136] text-[#b39ddb] border border-[#b39ddb] hover:bg-[#b39ddb] hover:text-[#181818] transition-colors duration-200 font-medium cursor-pointer shadow"
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
          
          {/* Minimal Subtle Background Pattern */}
          <div className="absolute inset-0 z-0 pointer-events-none mt-10">
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'radial-gradient(ellipse at 60% 20%, #b3b3c622 0%, transparent 60%), radial-gradient(ellipse at 80% 80%, #e0def422 0%, transparent 70%)',
            backgroundSize: 'cover',
            filter: 'blur(2px)'
          }} />
          </div>
        </section>


        {/* Featured Products */}
        <FeaturedProducts />

       
      </main>
    </div>
  )
}
