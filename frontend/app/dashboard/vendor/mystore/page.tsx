import React from 'react'
import Link from 'next/link'

const storeCategories = [
	{
		category: 'Electronics',
		stores: [
			{
				key: 'electronicStore1',
				name: 'electronicStore1',
				description:
					'Modern electronics store template with bold hero and navigation.',
				image: '/electronics-hero1.jpg',
				link: '/dashboard/vendor/mystore/electronicStores/electronicStore1',
			},
			{
				key: 'electronicStore2',
				name: 'electronicStore2',
				description: 'Clean, product-focused electronics landing page.',
				image: '/electronics-hero2.jpg',
				link: '/dashboard/vendor/mystore/electronicStores/electronicStore2',
			},
			{
				key: 'electronicStore3',
				name: 'electronicStore3',
				description:
					'Sleek, modern electronics homepage for tech brands.',
				image: '/electronics-hero3.jpg',
				link: '/dashboard/vendor/mystore/electronicStores/electronicStore3',
			},
			{
				key: 'electronicStore4',
				name: 'electronicStore4',
				description:
					'Bright, friendly electronics store with smart navigation.',
				image: '/electronics-hero4.jpg',
				link: '/dashboard/vendor/mystore/electronicStores/electronicStore4',
			},
			{
				key: 'electronicStore5',
				name: 'electronicStore5',
				description: 'Premium electronics template with gradient hero.',
				image: '/electronics-hero5.jpg',
				link: '/dashboard/vendor/mystore/electronicStores/electronicStore5',
			},
		],
	},
	{
		category: 'Fashion',
		stores: [
			{
				key: 'fashionStore1',
				name: 'fashionStore1',
				description:
					'Trendy fashion homepage with bold hero and navigation.',
				image: '/fashion-hero1.jpg',
				link: '/dashboard/vendor/mystore/fashionStores/fashionStore1',
			},
			{
				key: 'fashionStore2',
				name: 'fashionStore2',
				description: 'Modern, stylish fashion template.',
				image: '/fashion-hero2.jpg',
				link: '/dashboard/vendor/mystore/fashionStores/fashionStore2',
			},
			{
				key: 'fashionStore3',
				name: 'fashionStore3',
				description: 'Chic boutique fashion homepage.',
				image: '/fashion-hero3.jpg',
				link: '/dashboard/vendor/mystore/fashionStores/fashionStore3',
			},
			{
				key: 'fashionStore4',
				name: 'fashionStore4',
				description: 'Trendy styles for her.',
				image: '/fashion-hero4.jpg',
				link: '/dashboard/vendor/mystore/fashionStores/fashionStore4',
			},
			{
				key: 'fashionStore5',
				name: 'fashionStore5',
				description: 'Premium fashion for you.',
				image: '/fashion-hero5.jpg',
				link: '/dashboard/vendor/mystore/fashionStores/fashionStore5',
			},
		],
	},
	{
		category: 'Furniture',
		stores: [
			{
				key: 'furnitureStore1',
				name: 'furnitureStore1',
				description:
					'Modern furniture homepage with warm gradients.',
				image: '/furniture-hero1.jpg',
				link: '/dashboard/vendor/mystore/furnitureStores/furnitureStore1',
			},
			{
				key: 'furnitureStore2',
				name: 'furnitureStore2',
				description: 'Cozy living furniture template.',
				image: '/furniture-hero2.jpg',
				link: '/dashboard/vendor/mystore/furnitureStores/furnitureStore2',
			},
			{
				key: 'furnitureStore3',
				name: 'furnitureStore3',
				description: 'Elegant designs for modern homes.',
				image: '/furniture-hero3.jpg',
				link: '/dashboard/vendor/mystore/furnitureStores/furnitureStore3',
			},
			{
				key: 'furnitureStore4',
				name: 'furnitureStore4',
				description: 'Timeless pieces for every space.',
				image: '/furniture-hero4.jpg',
				link: '/dashboard/vendor/mystore/furnitureStores/furnitureStore4',
			},
			{
				key: 'furnitureStore5',
				name: 'furnitureStore5',
				description: 'Premium furniture, premium living.',
				image: '/furniture-hero5.jpg',
				link: '/dashboard/vendor/mystore/furnitureStores/furnitureStore5',
			},
		],
	},
]

export default function page() {
	return (
		<div className="max-w-7xl mx-auto py-10 px-4">
			<h1 className="text-3xl font-extrabold mb-8 text-center text-blue-900">
				Available Store Templates
			</h1>
			<div className="space-y-12">
				{storeCategories.map(cat => (
					<div key={cat.category}>
						<h2 className="text-2xl font-bold mb-6 text-blue-700">
							{cat.category}
						</h2>
						<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
							{cat.stores.map(store => (
								<div
									key={store.key}
									className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition p-0 overflow-hidden flex flex-col"
								>
									<div className="relative h-40 w-full overflow-hidden">
										<img
											src={store.image}
											alt={store.name}
											className="object-cover w-full h-full"
										/>
									</div>
									<div className="p-5 flex-1 flex flex-col">
										<h3 className="font-bold text-lg mb-2 text-blue-800">
											{store.name}
										</h3>
										<p className="text-gray-600 text-sm mb-4 flex-1">
											{store.description}
										</p>
										<Link
											href={store.link}
											className="mt-auto inline-block bg-blue-700 text-white px-4 py-2 rounded font-semibold text-center hover:bg-blue-800 transition"
										>
											View Demo
										</Link>
									</div>
								</div>
							))}
						</div>
					</div>
				))}
			</div>
		</div>
	)
}