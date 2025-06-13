'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from './ui/button'
import { motion, Variants } from 'framer-motion'

const navVariants: Variants = {
  hidden: { y: -100, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: [0.6, 0.05, 0.01, 0.9],
      staggerChildren: 0.1
    }
  }
}

const itemVariants: Variants = {
  hidden: { y: -20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
}

const buttonVariants: Variants = {
  hover: { 
    scale: 1.03,
    transition: {
      duration: 0.2,
      ease: "easeInOut"
    }
  },
  tap: { 
    scale: 0.97,
    transition: {
      duration: 0.1
    }
  }
}

export function Navbar(): JSX.Element {
  return (
    <motion.header 
      variants={navVariants}
      initial="hidden"
      animate="visible"
      className="fixed top-0 w-full z-50 border-b backdrop-blur-[6px] bg-white/40 dark:bg-gray-950/40"
    >
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <motion.span 
            className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-indigo-600 bg-clip-text text-transparent"
            variants={itemVariants}
            whileHover={{ 
              scale: 1.02,
              transition: { duration: 0.2 }
            }}
          >
            OpenMart
          </motion.span>
        </Link>

        <div className="hidden md:flex items-center space-x-6">
          {["Categories", "Vendors", "How it Works"].map((item) => (
            <motion.div
              key={item}
              variants={itemVariants}
            >
              <Link 
                href={`/${item.toLowerCase().replace(" ", "-")}`} 
                className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors duration-200"
              >
                {item}
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="flex items-center space-x-4">
          <motion.div
            variants={itemVariants}
          >
            <Button 
              variant="ghost" 
              className="hidden md:flex hover:bg-indigo-50 dark:hover:bg-indigo-950 transition-colors duration-200"
            >
              Sign In
            </Button>
          </motion.div>
          <motion.div
            variants={itemVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white transition-colors duration-200">
              Get Started
            </Button>
          </motion.div>
        </div>
      </nav>
    </motion.header>
  )
}
