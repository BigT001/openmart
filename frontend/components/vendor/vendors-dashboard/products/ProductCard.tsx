import React, { useState } from "react";
import LikeButton from "../../../ui/LikeButton";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface ProductCardProps {
  name: string;
  price: number | string;
  images?: string[];
  description?: string;
  stock?: number;
  category?: string;
  sku?: string;
  onEdit?: () => void;
  onDelete?: () => void;
  productId?: string;
  initialLikes?: number;
  likedByUser?: boolean;
}


import { useSession } from "next-auth/react";

export default function ProductCard({ name, price, images = [], description, stock, category, sku, onEdit, onDelete, productId, initialLikes = 0, likedByUser = false }: ProductCardProps) {
  const { data: session } = useSession();
  const [mainIdx, setMainIdx] = useState(0);
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(likedByUser);
  const [likeLoading, setLikeLoading] = useState(false);
  const getImageUrl = (img: string) => img.startsWith('/static/') ? `${API_URL}${img}` : img;
  const mainImage = images.length > 0 ? getImageUrl(images[mainIdx]) : undefined;

  // Only allow like if not already liked
  const handleLike = async () => {
    if (!productId || likeLoading || liked) return;
    setLikeLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/products/${productId}/like`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user: session?.user?.email }),
      });
      if (res.ok) {
        setLiked(true);
        setLikes((l) => l + 1);
      }
    } finally {
      setLikeLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col rounded-2xl shadow-lg border-2 border-purple-600 bg-white max-w-[210px] min-w-[180px] w-full mx-auto overflow-hidden group transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
      {/* Product Image - fills card, only top corners rounded, with like button overlay */}
      <div className="w-full aspect-[1/1.15] bg-gray-50 overflow-hidden relative">
        {mainImage ? (
          <img
            src={mainImage}
            alt={name}
            className="w-full h-full object-cover rounded-t-2xl"
            style={{ display: 'block' }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl text-gray-200 font-bold">🛒</div>
        )}
        {/* Like button overlay */}
        <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 20 }}>
          <LikeButton
            liked={liked}
            count={likes}
            loading={likeLoading}
            onClick={handleLike}
            buttonAriaLabel={liked ? 'Liked' : 'Like product'}
          />
        </div>
      </div>
      {/* Thumbnails centered below image */}
      {images.length > 1 && (
        <div className="flex gap-1 justify-center mt-2 mb-1 z-10 w-full">
          {images.map((img, idx) => (
            <button
              key={img + idx}
              onClick={() => setMainIdx(idx)}
              className={`w-6 h-6 rounded border ${mainIdx === idx ? "border-purple-600 ring-2 ring-purple-600" : "border-gray-200"} overflow-hidden focus:outline-none transition-transform duration-200 hover:scale-110 bg-white`}
              tabIndex={0}
              aria-label={`Show image ${idx + 1}`}
            >
              <img src={getImageUrl(img)} alt={name + " thumbnail " + (idx + 1)} className="object-cover w-full h-full" />
            </button>
          ))}
        </div>
      )}
      {/* Info Card */}
      <div className="flex-1 flex flex-col justify-between bg-white px-3 pt-2 pb-3 z-10 relative">
        <div className="flex flex-col items-center gap-0.5">
          <div className="text-base font-bold text-black text-center truncate w-full" title={name}>
            {name}
          </div>
          <div className="text-lg font-extrabold text-black mb-1 tracking-tight text-center">₦{price}</div>
          {description && (
            <div className="text-gray-700 text-xs text-center line-clamp-2 w-full mb-1 italic font-medium">{description}</div>
          )}
          <div className="flex flex-wrap justify-center gap-1 w-full text-[11px] text-gray-600 mb-1">
            {typeof stock === 'number' && <span className="bg-gray-100 px-2 py-0.5 rounded-full font-semibold">Stock: {stock}</span>}
            {category && <span className="bg-gray-100 px-2 py-0.5 rounded-full font-semibold">{category}</span>}
            {sku && <span className="bg-gray-100 px-2 py-0.5 rounded-full font-semibold">SKU: {sku}</span>}
          </div>
        </div>
        {/* Actions */}
        <div className="flex gap-2 mt-2 w-full justify-center">
          <button
            onClick={onEdit}
            className="px-3 py-1.5 rounded-lg bg-black text-white text-xs font-semibold shadow hover:bg-purple-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-600"
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            className="px-3 py-1.5 rounded-lg bg-white text-black border border-purple-600 text-xs font-semibold shadow hover:bg-purple-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
