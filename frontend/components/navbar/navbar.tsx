'use client'

import React, { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '../ui/button'
import { motion, Variants } from 'framer-motion'
import { useSession, signIn, signOut } from 'next-auth/react'
import { isVendor } from "@/lib/vendor";

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
  const [menuOpen, setMenuOpen] = useState(false);
  const [isVendorUser, setIsVendorUser] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  useEffect(() => {
    async function checkVendor() {
      if (session?.user?.email) {
        setIsVendorUser(await isVendor(session.user.email));
      } else {
        setIsVendorUser(false);
      }
    }
    checkVendor();
  }, [session]);

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

        {/* Auth button and user avatar on the right */}
        <div className="flex items-center space-x-3">
          {session && !isVendorUser && (
            <motion.div variants={itemVariants}>
              <Link href="/onboard-vendor">
                <Button 
                  variant="outline"
                  className="ml-2 border-indigo-500 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950 transition-colors duration-200 font-semibold"
                >
                  Become a Seller
                </Button>
              </Link>
            </motion.div>
          )}
          {session && isVendorUser && (
            <motion.div variants={itemVariants}>
              <Button 
                variant="ghost" 
                className="hover:bg-green-50 dark:hover:bg-green-950 transition-colors duration-200"
                onClick={() => window.location.href = '/dashboard/vendor'}
              >
                Dashboard
              </Button>
            </motion.div>
          )}
          {!session && (
            <motion.div variants={itemVariants}>
              <Button 
                variant="ghost" 
                className="hover:bg-indigo-50 dark:hover:bg-indigo-950 transition-colors duration-200"
                onClick={() => signIn('google')}
              >
                Sign In
              </Button>
            </motion.div>
          )}
          {session && (
            <motion.div variants={itemVariants} className="relative">
              <button
                className="focus:outline-none"
                onClick={() => setMenuOpen((open) => !open)}
                aria-label="User menu"
              >
                {session.user?.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user.name || 'User'}
                    className="w-9 h-9 rounded-full border border-gray-300 dark:border-gray-700 shadow-sm object-cover hover:ring-2 hover:ring-indigo-500 transition"
                    title={session.user.name ?? session.user.email ?? undefined}
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-lg border border-gray-300 dark:border-gray-700 hover:ring-2 hover:ring-indigo-500 transition" title={session.user?.name ?? session.user?.email ?? undefined}>
                    {session.user?.name ? session.user.name.charAt(0).toUpperCase() : (session.user?.email ? session.user.email.charAt(0).toUpperCase() : '?')}
                  </div>
                )}
              </button>
              {menuOpen && (
                <div ref={menuRef} className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50 animate-fade-in">
                  <Link href="/profile" className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-gray-800 transition-colors rounded-t-lg">
                    Profile
                  </Link>
                  <Link href="/settings" className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-gray-800 transition-colors">
                    Settings
                  </Link>
                  <div className="border-t border-gray-200 dark:border-gray-700 my-1" />
                  <button
                    onClick={() => { setMenuOpen(false); signOut(); }}
                    className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-gray-800 transition-colors rounded-b-lg font-semibold"
                  >
                    Log out
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </nav>
    </motion.header>
  )
}
