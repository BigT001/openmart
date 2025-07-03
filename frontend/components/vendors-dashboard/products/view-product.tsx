"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Checkout from "../../checkout/Checkout";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const CheckoutComponent = dynamic(() => import("../../checkout/Checkout"), { ssr: false });

interface ViewProductProps {
  productId: string;
  onClose?: () => void;
}

const ViewProduct: React.FC<ViewProductProps> = ({ productId, onClose }) => {
  const [product, setProduct] = useState<any>(null);
  const [mainIdx, setMainIdx] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chat, setChat] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<{ sender: string; message: string }[]>([]);
  const [showCheckout, setShowCheckout] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`${API_URL}/api/products/${productId}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch product');
        return res.json();
      })
      .then(data => {
        setProduct(data);
        setMainIdx(0);
      })
      .catch(err => setError(err.message || 'Error loading product'))
      .finally(() => setLoading(false));
  }, [productId]);

  const handleThumbClick = (idx: number) => setMainIdx(idx);

  const handleChatSend = () => {
    if (!chat.trim()) return;
    setChatHistory(prev => [...prev, { sender: "user", message: chat }]);
    setTimeout(() => {
      setChatHistory(prev => [...prev, { sender: "ai", message: "AI response coming soon..." }]);
    }, 800);
    setChat("");
  };

  if (loading) return <div className="text-center py-12 text-gray-400">Loading...</div>;
  if (error) return <div className="text-center py-12 text-red-500">{error}</div>;
  if (!product) return null;

  const images = Array.isArray(product.images) ? product.images : [];
  const showImages = images.map((img: string) => img.startsWith('/static/') ? `${API_URL}${img}` : img);

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
        onClick={onClose}
      >
        <div
          className="relative max-w-4xl w-full mx-auto bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col md:flex-row overflow-hidden"
          style={{ maxHeight: '95vh' }}
          onClick={e => e.stopPropagation()}
        >
          {/* Close (X) button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose?.();
            }}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 hover:bg-white shadow border border-gray-200 focus:outline-none cursor-pointer flex items-center justify-center"
            aria-label="Close"
            type="button"
            tabIndex={0}
          >
            <svg className="w-6 h-6 text-gray-700" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm2.47-10.53a.75.75 0 10-1.06-1.06L10 8.94 8.59 7.41a.75.75 0 10-1.06 1.06L8.94 10l-1.41 1.41a.75.75 0 101.06 1.06L10 11.06l1.41 1.41a.75.75 0 101.06-1.06L11.06 10l1.41-1.41z" clipRule="evenodd" /></svg>
          </button>
          {/* Image section */}
          <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 p-0 min-w-[380px] max-w-[520px]">
            <div className="relative w-full flex flex-col items-center justify-center" style={{ minHeight: '380px', maxHeight: '480px' }}>
              {showImages.length > 0 ? (
                <img
                  src={showImages[mainIdx]}
                  alt={product.name || 'Product'}
                  className="w-full h-[420px] object-contain rounded-none border-0 shadow-none bg-white"
                  style={{ display: 'block', maxWidth: '100%', maxHeight: '480px' }}
                />
              ) : (
                <div className="w-full h-64 flex items-center justify-center bg-gray-100 text-gray-300 rounded-none text-5xl">🛒</div>
              )}
              {/* Thumbnails below main image */}
              {showImages.length > 1 && (
                <div className="flex gap-2 justify-center mt-4 pb-2">
                  {showImages.map((img: string, i: number) => (
                    <button
                      key={img + i}
                      onClick={() => setMainIdx(i)}
                      className={`w-10 h-10 rounded-lg border-2 ${mainIdx === i ? "border-black ring-2 ring-gray-400" : "border-gray-200"} overflow-hidden focus:outline-none transition-transform duration-200 hover:scale-110 bg-white shadow`}
                      tabIndex={0}
                      aria-label={`Show image ${i + 1}`}
                    >
                      <img src={img} alt={product.name + " thumbnail " + (i + 1)} className="object-cover w-full h-full" />
                    </button>
                  ))}
                </div>
              )}
              {/* Color swatches selector below thumbnails if available */}
              {product.color && Array.isArray(product.color) && product.color.length > 0 && (
                <div className="flex flex-col items-start gap-1 mt-2 mb-2 w-full">
                  <span className="text-xs font-semibold text-gray-700 mb-1">Available colors:</span>
                  <div className="flex gap-2 flex-wrap">
                    {product.color.map((clr: string, idx: number) => (
                      <button
                        key={clr+idx}
                        className={`w-7 h-7 rounded-full border-2 flex items-center justify-center focus:outline-none ${mainIdx === idx ? 'border-black ring-2 ring-black' : 'border-gray-300'}`}
                        style={{ backgroundColor: clr, transition: 'border 0.2s' }}
                        title={clr}
                        tabIndex={0}
                        onClick={() => setMainIdx(idx < showImages.length ? idx : 0)}
                      >
                        {mainIdx === idx && <span className="w-3 h-3 bg-white rounded-full border border-gray-400" />}
                      </button>
                    ))}
                  </div>
                  {/* Show color name(s) below swatches */}
                  <div className="flex gap-2 mt-1 flex-wrap">
                    {product.color.map((clr: string, idx: number) => (
                      <span key={clr+idx} className={`text-xs font-mono px-2 py-1 rounded ${mainIdx === idx ? 'bg-black text-white' : 'bg-gray-200 text-gray-700'}`}>{clr}</span>
                    ))}
                  </div>
                </div>
              )}
              {/* If color is a single string, show it as a swatch and label */}
              {product.color && typeof product.color === 'string' && (
                <div className="flex flex-col items-start gap-1 mt-2 mb-2 w-full">
                  <span className="text-xs font-semibold text-gray-700 mb-1">Available color:</span>
                  <div className="flex gap-2 flex-wrap">
                    <span className="w-7 h-7 rounded-full border-2 border-gray-300" style={{ backgroundColor: product.color }} title={product.color}></span>
                  </div>
                  <div className="flex gap-2 mt-1 flex-wrap">
                    <span className="text-xs font-mono px-2 py-1 rounded bg-gray-200 text-gray-700">{product.color}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* Details section */}
          <div className="flex-1 flex flex-col justify-between p-8 bg-white h-full min-w-[320px]">
            <div className="flex-1 flex flex-col">
              <h1 className="text-3xl font-extrabold text-black mb-2 tracking-tight">
                {product.name}
              </h1>
              {/* Vendor business name always visible */}
              {product.vendor_name && (
                <div className="mb-3 text-sm text-gray-700 font-semibold">Store: <span className="font-mono text-black">{product.vendor_name}</span></div>
              )}
              <div className="flex items-center gap-4 mb-4">
                <span className="text-2xl font-bold text-black">
                  ₦{parseFloat(product.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                {product.stock !== undefined && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold">
                    <svg className="w-4 h-4 inline-block" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg>
                    In Stock: {product.stock}
                  </span>
                )}
                {product.status && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-200 text-gray-700 text-xs font-bold">
                    {product.status}
                  </span>
                )}
              </div>
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="inline-block px-3 py-1 rounded-full bg-gray-200 text-black text-xs font-semibold">
                  {product.category || 'Uncategorized'}
                </span>
                {product.sku && (
                  <span className="inline-block px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-mono border border-gray-200">
                    SKU: {product.sku}
                  </span>
                )}
                {/* Color swatches and text */}
                {product.color && (
                  <span className="flex items-center gap-1 ml-2">
                    {Array.isArray(product.color) ? product.color.map((clr: string, idx: number) => (
                      <span key={clr+idx} className="flex items-center gap-1">
                        <span className="w-4 h-4 rounded-full border border-gray-300" style={{ backgroundColor: clr }} title={clr}></span>
                        <span className="text-xs text-gray-700 font-mono">{clr}</span>
                      </span>
                    )) : (
                      <span className="flex items-center gap-1">
                        <span className="w-4 h-4 rounded-full border border-gray-300" style={{ backgroundColor: product.color }} title={product.color}></span>
                        <span className="text-xs text-gray-700 font-mono">{product.color}</span>
                      </span>
                    )}
                  </span>
                )}
              </div>
              {/* Description scrollable only, now taller/wider */}
              <div className="text-base text-gray-700 mb-4 whitespace-pre-line leading-relaxed break-words border-t pt-4 max-h-60 min-h-32 overflow-y-auto pr-2">
                {product.description}
              </div>
              {/* Show any other fields dynamically, except vendor_id and created_at */}
              {Object.entries(product).map(([key, value]) => {
                if (["id","name","price","description","category","stock","sku","vendor_id","created_at","images","status","vendor_name","color"].includes(key)) return null;
                if (value === null || value === undefined || value === "") return null;
                return (
                  <div key={key} className="mb-2 text-xs text-gray-500 flex gap-2">
                    <span className="capitalize font-semibold">{key.replace(/_/g, ' ')}:</span>
                    <span className="font-mono">{typeof value === 'object' ? JSON.stringify(value) : String(value)}</span>
                  </div>
                );
              })}
            </div>
            
            {/* Add to Cart and Check Cart buttons */}
            <div className="flex items-center gap-4 mb-6">
              <button className="py-3 px-8 rounded bg-black text-white text-base font-bold shadow hover:bg-gray-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-black flex items-center gap-2" type="button">
                {/* Shopping basket icon */}
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 11l1 9a2 2 0 002 2h8a2 2 0 002-2l1-9M9 11V7a3 3 0 116 0v4" /><path strokeLinecap="round" strokeLinejoin="round" d="M5 11h14" /></svg>
                Add to Cart
              </button>
              <button
                className="py-3 px-8 rounded bg-white text-black border border-gray-300 text-base font-bold shadow hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-black flex items-center gap-2"
                type="button"
                onClick={() => setShowCheckout(true)}
              >
                {/* Cart icon */}
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" /></svg>
                CheckOut
              </button>
            </div>
            {/* Chat interface */}
            <div className="sticky bottom-0 left-0 right-0 bg-white pt-4 border-t" style={{ zIndex: 10 }}>
              <h2 className="text-base font-bold mb-2 text-black flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 8h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2" /><circle cx="12" cy="7" r="4" /></svg>
                Ask about this product
              </h2>
              <div className="max-h-20 overflow-y-auto mb-2 bg-gray-50 rounded-lg p-2 flex flex-col gap-2">
                {chatHistory.length === 0 && <div className="text-gray-400">No messages yet.</div>}
                {chatHistory.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`px-3 py-2 rounded-xl text-sm shadow-sm max-w-[80%] ${msg.sender === 'user' ? 'bg-black text-white' : 'bg-gray-200 text-gray-900'}`} style={{ wordBreak: 'break-word' }}>{msg.message}</div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chat}
                  onChange={e => setChat(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleChatSend(); }}
                  className="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black bg-white text-sm"
                  placeholder="Ask a question about this product..."
                />
                <button
                  onClick={handleChatSend}
                  className="px-5 py-2 rounded-lg bg-black text-white text-sm font-semibold shadow hover:bg-gray-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-black flex items-center gap-2"
                  type="button"
                >
                  {/* Send icon */}
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4h16M4 12h16M4 20h16" /></svg>
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Checkout Modal Overlay */}
      {showCheckout && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <Checkout onClose={() => setShowCheckout(false)} product={product} />
        </div>
      )}
    </>
  );
};

export default ViewProduct;
