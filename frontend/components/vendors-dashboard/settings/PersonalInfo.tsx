"use client";

import React, { useEffect, useState } from "react";

interface UserInfo {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  google_id?: string;
  created_at: string;
  updated_at: string;
  last_login: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const PersonalInfo: React.FC<{ email: string }> = ({ email }) => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!email) return;
    setLoading(true);
    fetch(`${API_URL}/api/users/by-email?email=${encodeURIComponent(email)}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch user info");
        return res.json();
      })
      .then((data) => {
        setUser(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [email]);

  if (loading) return <div className="animate-pulse text-gray-400">Loading personal info...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!user) return <div>No user data found.</div>;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 w-full mt-0 border border-gray-200">
      <div className="flex items-center gap-4 mb-6">
        {user.avatar_url ? (
          <img src={user.avatar_url} alt={user.full_name} className="w-16 h-16 rounded-full object-cover border border-gray-200" />
        ) : (
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-3xl font-bold text-black border border-gray-200">
            {user.full_name?.charAt(0) || '?'}
          </div>
        )}
        <div>
          <h2 className="text-2xl font-extrabold text-black mb-1">{user.full_name}</h2>
          <span className="block text-sm text-gray-500">{user.email}</span>
        </div>
      </div>
      <hr className="mb-6 border-gray-200" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">User ID</label>
          <div className="text-base text-black font-medium break-all">{user.id}</div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Google ID</label>
          <div className="text-base text-black font-medium break-all">{user.google_id || '—'}</div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Created At</label>
          <div className="text-base text-black font-medium">{new Date(user.created_at).toLocaleString()}</div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Last Login</label>
          <div className="text-base text-black font-medium">{new Date(user.last_login).toLocaleString()}</div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Updated At</label>
          <div className="text-base text-black font-medium">{new Date(user.updated_at).toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfo;
