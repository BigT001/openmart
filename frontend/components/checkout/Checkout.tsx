"use client";

import React, { useState } from "react";

interface CheckoutProps {
  onClose: () => void;
  product: any;
}

const deliveryMethods = [
  { label: "Store", value: "store" },
  { label: "Delivery", value: "delivery" },
];
const paymentMethods = [
  { label: "VISA", value: "visa", icon: (
    <svg className="w-8 h-6" viewBox="0 0 48 32"><rect width="48" height="32" rx="6" fill="#fff"/><text x="24" y="22" textAnchor="middle" fontSize="16" fill="#1a237e" fontWeight="bold">VISA</text></svg>
  ) },
  { label: "Mastercard", value: "mastercard", icon: (
    <svg className="w-8 h-6" viewBox="0 0 48 32"><rect width="48" height="32" rx="6" fill="#fff"/><circle cx="18" cy="16" r="8" fill="#ff9800"/><circle cx="30" cy="16" r="8" fill="#f44336"/><text x="24" y="22" textAnchor="middle" fontSize="10" fill="#fff" fontWeight="bold">MC</text></svg>
  ) },
  { label: "PayPal", value: "paypal", icon: (
    <svg className="w-8 h-6" viewBox="0 0 48 32"><rect width="48" height="32" rx="6" fill="#fff"/><text x="24" y="22" textAnchor="middle" fontSize="14" fill="#1976d2" fontWeight="bold">PayPal</text></svg>
  ) },
];

const Checkout: React.FC<CheckoutProps> = ({ onClose, product }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
    card: "",
    expiry: "",
    cvc: ""
  });
  const [submitted, setSubmitted] = useState(false);
  const [delivery, setDelivery] = useState("delivery");
  const [payment, setPayment] = useState("visa");
  const [saveCard, setSaveCard] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // Here you would handle payment logic
  };

  if (submitted) {
    return (
      <div className="p-8 text-center relative">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-black text-2xl font-bold focus:outline-none"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4">Thank you for your order!</h2>
        <p className="text-gray-700">Your payment is being processed. You will receive a confirmation email soon.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col md:flex-row overflow-hidden relative animate-fade-in">
      {/* Close button */}
      <button
        className="absolute top-4 right-4 text-gray-400 hover:text-black text-2xl font-bold focus:outline-none z-10"
        onClick={onClose}
        aria-label="Close"
      >
        &times;
      </button>
      {/* Left: Form */}
      <form onSubmit={handleSubmit} className="flex-1 p-8 bg-gradient-to-br from-white via-gray-50 to-gray-100 flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-6">Checkout</h2>
          {/* 1. Contact Information */}
          <div className="mb-6">
            <h3 className="font-semibold text-lg mb-2">1. Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
              <input name="name" type="text" required placeholder="Full Name" value={form.name} onChange={handleChange} className="px-4 py-2 border rounded focus:ring-2 focus:ring-black bg-white" />
              <input name="email" type="email" required placeholder="Email" value={form.email} onChange={handleChange} className="px-4 py-2 border rounded focus:ring-2 focus:ring-black bg-white" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="phone" type="tel" required placeholder="Phone Number" value={form.phone} onChange={handleChange} className="px-4 py-2 border rounded focus:ring-2 focus:ring-black bg-white" />
              <textarea name="address" required placeholder="Shipping Address" value={form.address} onChange={handleChange} className="px-4 py-2 border rounded focus:ring-2 focus:ring-black bg-white min-h-[48px] resize-y" />
            </div>
          </div>
          {/* 2. Delivery Method */}
          <div className="mb-6">
            <h3 className="font-semibold text-lg mb-2">2. Delivery method</h3>
            <div className="flex gap-4 mb-2">
              {deliveryMethods.map((m) => (
                <button
                  key={m.value}
                  type="button"
                  className={`px-5 py-1.5 rounded-full border text-base font-semibold transition-colors duration-150 focus:outline-none ${delivery === m.value ? 'bg-black text-white border-black shadow' : 'bg-white text-black border-gray-300 hover:bg-gray-100'}`}
                  onClick={() => setDelivery(m.value)}
                  style={{ fontSize: '1rem', minWidth: 90 }}
                >
                  {m.label}
                </button>
              ))}
            </div>
            {delivery === "delivery" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                <input type="date" className="px-4 py-2 border rounded focus:ring-2 focus:ring-black bg-white" />
                <input type="text" placeholder="Convenient Time" className="px-4 py-2 border rounded focus:ring-2 focus:ring-black bg-white" />
                <input type="text" placeholder="City" className="px-4 py-2 border rounded focus:ring-2 focus:ring-black bg-white" />
              </div>
            )}
          </div>
          {/* 3. Payment Method */}
          <div className="mb-6">
            <h3 className="font-semibold text-lg mb-2">3. Payment method</h3>
            <div className="flex gap-3 mb-4">
              {paymentMethods.map((m) => (
                <button
                  key={m.value}
                  type="button"
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-lg border transition-colors duration-150 focus:outline-none shadow-sm ${payment === m.value ? 'bg-black text-white border-black scale-105' : 'bg-white text-black border-gray-300 hover:bg-gray-100'}`}
                  onClick={() => setPayment(m.value)}
                  style={{ fontSize: '1rem', minWidth: 90 }}
                >
                  <span className="w-7 h-5 flex items-center justify-center">{m.icon}</span>
                  <span className="font-semibold text-base">{m.label}</span>
                </button>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input name="card" type="text" required placeholder="Card Number" value={form.card} onChange={handleChange} className="px-4 py-2 border rounded focus:ring-2 focus:ring-black bg-white col-span-2" />
              <input name="expiry" type="text" required placeholder="MM/YY" value={form.expiry} onChange={handleChange} className="px-4 py-2 border rounded focus:ring-2 focus:ring-black bg-white" />
              <input name="cvc" type="text" required placeholder="CVC" value={form.cvc} onChange={handleChange} className="px-4 py-2 border rounded focus:ring-2 focus:ring-black bg-white" />
            </div>
            <div className="flex items-center mt-3">
              <input id="saveCard" type="checkbox" checked={saveCard} onChange={() => setSaveCard(!saveCard)} className="mr-2" />
              <label htmlFor="saveCard" className="text-sm text-gray-600">Save information for future</label>
            </div>
          </div>
        </div>
        <button type="submit" className="w-full py-3 rounded bg-black text-white font-bold shadow hover:bg-gray-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-black mt-4">Pay Now</button>
      </form>
      {/* Right: Order Summary */}
      <div className="w-full md:w-96 bg-white/80 border-l border-gray-100 p-8 flex flex-col justify-between min-h-full">
        <div>
          <h3 className="font-semibold text-lg mb-4">Order</h3>
          {product && (
            <div className="flex items-center gap-4 mb-4">
              <img src={product.image || product.images?.[0]} alt={product.name} className="w-16 h-16 object-cover rounded-lg border" />
              <div>
                <div className="font-semibold">{product.name}</div>
                <div className="text-xs text-gray-500">{product.vendor_name}</div>
                {product.color && <div className="text-xs text-gray-500">Color: {Array.isArray(product.color) ? product.color[0] : product.color}</div>}
              </div>
            </div>
          )}
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>${product?.price || 0}</span></div>
            <div className="flex justify-between"><span>Discount</span><span className="text-green-600">-$0</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>Free</span></div>
            <div className="border-t my-2"></div>
            <div className="flex justify-between font-bold text-lg"><span>Total</span><span>${product?.price || 0}</span></div>
          </div>
        </div>
        <div className="mt-8 flex items-center gap-2 text-xs text-gray-500">
          <input id="agree" type="checkbox" className="mr-2" />
          <label htmlFor="agree">By confirming the order, I accept the terms of the user agreement</label>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
