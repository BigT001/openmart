"use client";

import React, { useEffect, useState } from "react";

interface Vendor {
  business_name: string;
  business_description: string;
  business_email: string;
  business_phone: string;
  business_address: string;
  registration_number: string;
  verification_status: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const statusColors: Record<string, string> = {
  verified: "bg-green-100 text-green-800 border-green-300",
  pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
  rejected: "bg-red-100 text-red-800 border-red-300",
};

const VendorsProfile: React.FC<{ vendorId?: string }> = ({ vendorId }) => {
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (!vendorId) return;
    setLoading(true);
    fetch(`${API_URL}/api/vendors/${vendorId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch vendor");
        return res.json();
      })
      .then((data) => {
        setVendor(data);
        setLoading(false);
        setTimeout(() => setAnimate(true), 100); // trigger animation
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [vendorId]);

  if (loading) return <div className="animate-pulse text-gray-400">Loading vendor profile...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!vendor) return <div>No vendor data found.</div>;

  return (
    <div
      className={`bg-white rounded-2xl shadow-lg p-8 w-full mt-0 border border-gray-200 transition-all duration-700 ease-out ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
    >
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-3xl font-bold text-black border border-gray-200">
          {vendor.business_name?.charAt(0) || '?'}
        </div>
        <div>
          <h2 className="text-3xl font-extrabold text-black mb-1">{vendor.business_name}</h2>
          <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full border ${statusColors[vendor.verification_status?.toLowerCase()] || 'bg-gray-100 text-gray-700 border-gray-300'}`}>{vendor.verification_status}</span>
        </div>
      </div>
      <hr className="mb-6 border-gray-200" />
      <div className="mb-6">
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Description</label>
        <div className="text-base text-black font-medium whitespace-pre-line">{vendor.business_description}</div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Phone</label>
          <div className="text-base text-black font-medium">{vendor.business_phone}</div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Address</label>
          <div className="text-base text-black font-medium">{vendor.business_address}</div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Registration Number</label>
          <div className="text-base text-black font-medium">{vendor.registration_number}</div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Email</label>
          <div className="text-base text-black font-medium break-all">{vendor.business_email}</div>
        </div>
      </div>
    </div>
  );
};

export default VendorsProfile;
