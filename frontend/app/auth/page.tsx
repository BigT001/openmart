'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

export default function AuthPage() {
  const router = useRouter()

  const handleEmailLogin = () => {
    router.push('/dashboard')
  }

  const handleInstagramLogin = () => {
    // We'll implement this with actual Instagram OAuth later
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md space-y-8"
      >
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Welcome to OpenMART
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Connect and start discovering amazing products
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleEmailLogin}
            className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
          >
            Continue with Email
          </button>

          <button
            onClick={handleInstagramLogin}
            className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-lg text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
          >
            Continue with Instagram
          </button>
        </div>

        <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
          By continuing, you agree to OpenMART's Terms of Service and Privacy Policy
        </p>
      </motion.div>
    </div>
  )
}
