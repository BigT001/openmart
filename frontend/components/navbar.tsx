'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from './ui/button'
import { motion, Variants } from 'framer-motion'
import { useSession, signIn, signOut } from 'next-auth/react'

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

export function Navbar() {
  const { data: session } = useSession();

  return (
    <motion.header 
      variants={navVariants}
      initial="hidden"
      animate="visible"
      className="fixed top-0 w-full z-50 border-b backdrop-blur-[6px] bg-white/40 dark:bg-gray-950/40"
    >
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo on the left */}
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

        {/* Centered Blog link */}
        <div className="flex-1 flex justify-center">
          <motion.div variants={itemVariants}>
            <Link 
              href="/blog" 
              className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors duration-200 text-lg font-semibold"
            >
              Blog
            </Link>
          </motion.div>
        </div>

        {/* Auth button on the right */}
        <div className="flex items-center">
          <motion.div variants={itemVariants}>
            {session ? (
              <Button 
                variant="ghost" 
                className="hover:bg-green-50 dark:hover:bg-green-950 transition-colors duration-200"
                onClick={() => window.location.href = '/dashboard'}
              >
                Sell Your Product
              </Button>
            ) : (
              <Button 
                variant="ghost" 
                className="hover:bg-indigo-50 dark:hover:bg-indigo-950 transition-colors duration-200"
                onClick={() => signIn('google')}
              >
                Sign In
              </Button>
            )}
          </motion.div>
        </div>
      </nav>
    </motion.header>
  )
}
