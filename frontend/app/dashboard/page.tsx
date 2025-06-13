'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const router = useRouter()
  const [isConnecting, setIsConnecting] = useState(false)

  const handleConnectInstagram = async () => {
    setIsConnecting(true)
    try {
      // We'll implement actual Instagram OAuth here later
      // For now, just simulate the connection
      await new Promise(resolve => setTimeout(resolve, 1500))
      router.push('/')
    } catch (error) {
      console.error('Failed to connect Instagram:', error)
    } finally {
      setIsConnecting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 p-4">
      <div className="max-w-4xl mx-auto py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
        >
          <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            One Last Step
          </h1>

          <div className="space-y-6">
            <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-xl">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                Connect Your Instagram Account
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Connect your Instagram account to:
              </p>
              <ul className="space-y-3 text-gray-600 dark:text-gray-400 mb-6">
                <li className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Access your profile information
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  View and manage your products
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Optimize your product listings
                </li>
              </ul>
              <button
                onClick={handleConnectInstagram}
                disabled={isConnecting}
                className={`w-full flex items-center justify-center px-4 py-3 rounded-lg text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200 ${
                  isConnecting ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                {isConnecting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Connecting...
                  </>
                ) : (
                  'Connect Instagram'
                )}
              </button>
            </div>

            <div className="text-center text-sm text-gray-600 dark:text-gray-400">
              <p>
                OpenMART will not post anything without your permission.
                <br />
                You can disconnect your account at any time.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
