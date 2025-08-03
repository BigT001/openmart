"use client";
import React, { useState } from "react";




interface CartItem {
  id: string;
  name: string;
  price: number;
  images?: string[];
  quantity: number;
}
// interface CartPageProps { // Removed incomplete interface declaration

// ...existing code...

// Replace with real user ID from auth/session
const USER_ID = typeof window !== "undefined" ? localStorage.getItem("user_id") || "demo-user-id" : "demo-user-id";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const Cart: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [coupon, setCoupon] = useState("");

  // Fetch cart from backend
  React.useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_URL}/api/cart?user_id=${USER_ID}`);
        if (!res.ok) throw new Error("Failed to fetch cart");
        const data = await res.json();
        setCart(data);
      } catch (err: any) {
        setError(err.message || "Error loading cart");
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, [USER_ID]);

  // Update quantity in backend
  const handleQuantity = async (id: string, delta: number) => {
    const item = cart.find((i) => i.id === id);
    if (!item) return;
    const newQty = Math.max(1, item.quantity + delta);
    try {
      const res = await fetch(`${API_URL}/api/cart/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: USER_ID, product_id: id, quantity: delta }),
      });
      if (!res.ok) throw new Error("Failed to update cart");
      const updated = await res.json();
      setCart(updated);
    } catch (err: any) {
      setError(err.message || "Error updating cart");
    }
  };

  // Remove item from cart (set quantity to 0)
  const handleRemove = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/api/cart/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: USER_ID, product_id: id, quantity: -999 }),
      });
      if (!res.ok) throw new Error("Failed to remove item");
      const updated = await res.json();
      setCart(updated.filter((item: CartItem) => item.quantity > 0));
    } catch (err: any) {
      setError(err.message || "Error removing item");
    }
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (loading) return <div className="text-center py-12 text-gray-400">Loading cart...</div>;
  if (error) return <div className="text-center py-12 text-red-500">{error}</div>;

  return (
    <div className="flex flex-col items-center py-1 px-0">
      <div className="w-full flex flex-col md:flex-row gap-8">
        {/* Cart Items */}
        <div className="flex-1 bg-white rounded-xl shadow border border-[#e0e0e0] p-4 min-w-0 w-full" style={{ maxHeight: 5 * 104 + 64 + 56 + 'px', height: 5 * 104 + 64 + 56 + 'px', display: 'flex', flexDirection: 'column', borderWidth: '1px', borderStyle: 'solid', borderColor: '#004D40' }}>
          <div className="flex items-center mb-4">
            <h1 className="text-xl font-bold flex-1 text-[#004D40]">Cart</h1>
            <span className="text-xs text-gray-400 font-semibold">{cart.length} items</span>
          </div>
          <div style={{ flex: 1, maxHeight: 5 * 104 + 'px', overflowY: 'auto' }} className="custom-scrollbar">
            {cart.map((item) => (
              <div key={item.id} className="flex items-center gap-3 py-3 border-b last:border-b-0 hover:bg-[#f7f7f7] transition rounded-lg" style={{ minHeight: 80 }}>
                <img
                  src={item.images && item.images.length > 0 ? item.images[0] : "/file.svg"}
                  alt={item.name}
                  className="w-14 h-14 object-cover rounded-lg border border-[#e0e0e0] bg-[#f7f7f7]"
                  style={{ background: "#f7f7f7" }}
                />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-base truncate text-[#004D40]">{item.name}</div>
                  {/* Description can be added if returned from backend */}
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[#009688] font-semibold text-sm">₦{item.price.toFixed(2)}</span>
                    <div className="flex items-center gap-1 ml-2">
                      <button
                        className="w-5 h-5 rounded bg-white border border-[#e0e0e0] text-[#009688] hover:bg-[#e0f7fa] flex items-center justify-center transition"
                        onClick={() => handleQuantity(item.id, -1)}
                        aria-label="Decrease quantity"
                      >
                        <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                      </button>
                      <span className="w-5 text-center font-semibold text-[#004D40]">{item.quantity}</span>
                      <button
                        className="w-5 h-5 rounded bg-white border border-[#e0e0e0] text-[#009688] hover:bg-[#e0f7fa] flex items-center justify-center transition"
                        onClick={() => handleQuantity(item.id, 1)}
                        aria-label="Increase quantity"
                      >
                        <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                      </button>
                    </div>
                    <span className="ml-auto font-semibold text-[#009688]">₦{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
                <button
                  className="text-gray-300 hover:text-red-500 focus:outline-none transition-colors duration-150 rounded-full bg-white px-2 py-1 border border-[#e0e0e0]"
                  onClick={() => handleRemove(item.id)}
                  aria-label="Remove item"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          {/* Coupon and update cart */}
          <div className="flex flex-col md:flex-row items-center gap-2 mt-6 border-t pt-4">
            <div className="flex-1 flex items-center gap-2 w-full">
              <span className="text-[#009688] text-xs font-semibold">Have a coupon?</span>
              <input
                type="text"
                className="border border-[#009688]/40 rounded px-3 py-2 flex-1 min-w-0 text-xs bg-[#e0f7fa] focus:border-[#009688] focus:ring-2 focus:ring-[#009688]/20 transition"
                placeholder="Coupon code"
                value={coupon}
                onChange={e => setCoupon(e.target.value)}
              />
              <button className="border border-[#009688] px-3 py-2 rounded text-xs font-bold bg-[#009688] text-white hover:bg-[#004D40] transition">APPLY</button>
            </div>
            <button className="text-xs text-[#009688] border border-[#009688]/40 rounded px-3 py-2 bg-white hover:bg-[#e0f7fa] font-bold transition">UPDATE CART</button>
          </div>
        </div>
        {/* Cart Totals */}
        <div className="w-full md:w-[420px] bg-white rounded-xl shadow p-8 h-fit border-2 border-[#004D40]" style={{ borderWidth: '1px', borderStyle: 'solid', borderColor: '#004D40' }}>
          <h2 className="text-xl font-bold mb-6 text-[#004D40]">CART TOTALS</h2>
          <div className="flex flex-col gap-3 text-gray-700 text-base">
            <div className="flex justify-between border-b pb-2">
              <span>Shipping (3-5 Business Days)</span>
              <span className="font-medium">Free</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span>TAX (estimated for the United States (US))</span>
              <span className="font-medium">₦0</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span>Subtotal</span>
              <span className="font-medium">₦{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mt-2 text-lg font-bold">
              <span className="text-[#004D40]">Total</span>
              <span className="text-[#004D40]">₦{subtotal.toFixed(2)}</span>
            </div>
          </div>
          <button className="w-full mt-8 py-3 bg-black text-white font-semibold rounded transition hover:bg-gray-900">PROCEED TO CHECKOUT</button>
          <div className="mt-4 text-center">
            <a href="#" className="text-gray-500 text-sm hover:underline">&lt; CONTINUE SHOPPING</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
