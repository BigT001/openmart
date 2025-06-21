import type { NextApiRequest, NextApiResponse } from 'next'

// Dummy featured products data for now
const featuredProducts = [
  {
    title: 'iPhone 13 Pro',
    price: 480000,
    image: '/file.svg',
    seller: 'Apple Store',
    source: 'Instagram',
    post_url: 'https://instagram.com/apple',
  },
  {
    title: 'Nike Air Max',
    price: 90000,
    image: '/globe.svg',
    seller: 'Nike Lagos',
    source: 'Instagram',
    post_url: 'https://instagram.com/nike',
  },
  {
    title: 'PS5 Console',
    price: 350000,
    image: '/vercel.svg',
    seller: 'GameHub',
    source: 'Instagram',
    post_url: 'https://instagram.com/gamehub',
  },
  {
    title: 'Red Heels',
    price: 25000,
    image: '/next.svg',
    seller: 'HeelsNG',
    source: 'Instagram',
    post_url: 'https://instagram.com/heelsng',
  },
]

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    res.status(200).json(featuredProducts)
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}
