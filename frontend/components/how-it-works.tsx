'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { CSSProperties } from 'react'

interface Step {
	title: string
	description: string
	icon: string
	gradient: string
}

const steps: Step[] = [
	{
		title: 'Smart Search',
		description:
			"Describe what you want naturally - our AI understands and finds the perfect match",
		icon: '/globe.svg',
		gradient: 'from-blue-500 to-indigo-500',
	},
	{
		title: 'AI Product Discovery',
		description:
			'Our AI scans thousands of products across platforms to find the best matches at the best prices',
		icon: '/window.svg',
		gradient: 'from-indigo-500 to-purple-500',
	},
	{
		title: 'Secure Purchase',
		description:
			'Add to cart and checkout securely. We handle the entire transaction process for you',
		icon: '/file.svg',
		gradient: 'from-purple-500 to-pink-500',
	},
	{
		title: 'Automated Fulfillment',
		description:
			'We coordinate with vendors behind the scenes to ensure fast and reliable delivery to your doorstep',
		icon: '/file.svg',
		gradient: 'from-pink-500 to-rose-500',
	},
]

const containerVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.3,
		},
	},
}

const cardVariants = {
	hidden: { y: 50, opacity: 0 },
	visible: {
		y: 0,
		opacity: 1,
		transition: {
			type: 'spring',
			damping: 15,
			stiffness: 100,
		},
	},
}

export function HowItWorks(): React.ReactElement {
	return (
		<section className="py-24 bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900">
			<div className="container mx-auto px-4">
				<motion.div
					className="text-center mb-16"
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6 }}
				>
					<h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
						How OpenMart Works
					</h2>
					<p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
						Experience seamless AI-powered shopping - from search to delivery
					</p>
				</motion.div>

				<motion.div
					className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative"
					variants={containerVariants}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true }}
				>
					{steps.map((step, index) => (
						<motion.div
							key={step.title}
							variants={cardVariants}
							whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
							className="relative group"
						>
							<div
								className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl -z-10"
								style={{
									background: `linear-gradient(to right, var(--tw-gradient-stops))`,
									'--tw-gradient-from': `var(--${step.gradient.split(' ')[1]})`,
									'--tw-gradient-to': `var(--${step.gradient.split(' ')[3]})`,
									'--tw-gradient-stops': `var(--tw-gradient-from), var(--tw-gradient-to)`,
								} as CSSProperties}
							/>

							<div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-gray-700 h-full flex flex-col items-center text-center">
								<div
									className={`w-16 h-16 rounded-full bg-gradient-to-r ${step.gradient} p-3 mb-6`}
								>
									<Image
										src={step.icon}
										alt={step.title}
										width={40}
										height={40}
										className="w-full h-full object-contain invert"
									/>
								</div>

								<h3 className="text-xl font-semibold mb-3">{step.title}</h3>
								<p className="text-gray-600 dark:text-gray-300 text-sm">
									{step.description}
								</p>

								{index < steps.length - 1 && (
									<motion.div
										className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10"
										initial={{ scale: 0.5, opacity: 0 }}
										whileInView={{ scale: 1, opacity: 1 }}
										viewport={{ once: true }}
										transition={{ delay: 0.5 }}
									>
										<svg
											width="24"
											height="24"
											viewBox="0 0 24 24"
											fill="none"
											className="text-indigo-500 dark:text-indigo-400"
										>
											<path
												d="M5 12h14m-7-7l7 7-7 7"
												stroke="currentColor"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
											/>
										</svg>
									</motion.div>
								)}

								<div className="mt-4 text-sm font-medium text-indigo-600 dark:text-indigo-400">
									Step {index + 1}
								</div>
							</div>
						</motion.div>
					))}
				</motion.div>

				<motion.div
					className="mt-16 text-center"
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					viewport={{ once: true }}
					transition={{ delay: 0.8 }}
				>
					<p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
						Our AI-powered platform handles everything from product discovery to delivery coordination, giving you a seamless shopping experience.
					</p>
					<a
						href="#get-started"
						className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200"
					>
						Start Shopping Now
					</a>
				</motion.div>
			</div>
		</section>
	)
}
