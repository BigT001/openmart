"use client";


import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import SettingsPanel from "@/components/vendors-dashboard/SettingsPanel";


const EditProfile = dynamic(() => import("./EditProfile"), { ssr: false });
const AddProductForm = dynamic(() => import("./products/AddProductForm"), { ssr: false });


import { useSession } from "next-auth/react";


interface StoreProfile {
  imageUrl: string;
  username: string;
  subtitle: string;
  following: number;
  followers: number;
  likes: number;
  bio: string;
  likedByUser?: boolean;
}


export default function StoreHeader() {
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState<StoreProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEdit, setShowEdit] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  // Settings modal state
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!session?.user?.email) {
        setError("Not authenticated");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        const res = await fetch(`${API_URL}/api/vendors/by-user?email=${encodeURIComponent(session.user.email)}`);
        const data = await res.json();
        console.log('Vendor profile API response:', data);
        if (data.vendor_profile) {
          setProfile({
            imageUrl: data.vendor_profile.imageUrl || "/profile.jpg",
            username: data.vendor_profile.username || "Store Name",
            subtitle: data.vendor_profile.subtitle || "",
            following: data.vendor_profile.following || 0,
            followers: data.vendor_profile.followers || 0,
            likes: data.vendor_profile.likes || 0,
            bio: data.vendor_profile.bio || "",
            likedByUser: !!data.vendor_profile.likedByUser,
          });
        } else {
          // Fallback to session user info if no vendor profile found
          setProfile({
            imageUrl: session.user.image || "/profile.jpg",
            username: session.user.name || session.user.email || "Store Name",
            subtitle: "",
            following: 0,
            followers: 0,
            likes: 0,
            bio: "",
            likedByUser: false,
          });
        }
      } catch (err: any) {
        setError("Failed to load store profile");
      } finally {
        setLoading(false);
      }
    };
    if (status === "authenticated") fetchProfile();
  }, [session, status]);

  if (loading) {
    return <div className="w-full flex justify-center items-center py-8 text-gray-400">Loading store profile...</div>;
  }
  if (error || !profile) {
    return <div className="w-full flex justify-center items-center py-8 text-red-500">{error || "Profile not found"}</div>;
  }

  return (
    <header className="flex flex-col sm:flex-row items-center sm:items-start 
      gap-6 sm:gap-8 px-2 py-2 w-full bg-[#181818] 
      rounded-2xl text-white">
      {/* Profile Image */}
      <div className="w-40 h-40 sm:w-56 sm:h-56 rounded-full overflow-hidden 
      flex-shrink-0 border-2 border-[#232136] relative group">
        <input
          type="file"
          accept="image/*"
          id="profile-upload"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
          onChange={e => {
            const file = e.target.files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = (event) => {
                const img = document.getElementById('profile-img') as HTMLImageElement;
                if (img && event.target?.result) {
                  img.src = event.target.result as string;
                }
              };
              reader.readAsDataURL(file);
            }
          }}
        />
        <img
          id="profile-img"
          src={profile.imageUrl}
          alt={profile.username}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <span className="text-white font-semibold text-sm">Upload Image</span>
        </div>
      </div>


      {/* Profile Info */}
      <div className="flex-1 flex flex-col items-center sm:items-start w-full py-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full">
          <span className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
            {profile.username || "Business Name"}
          </span>
          <span className="text-base sm:text-lg text-[#b39ddb] font-normal whitespace-nowrap">
            {profile.subtitle}
          </span>
        </div>
        <div className="flex flex-wrap gap-2 mt-3 mb-3 w-full justify-center sm:justify-start">
          <button
            className="bg-[#232136] hover:bg-[#181024] text-white font-bold px-5 py-2 rounded-md text-base transition-all border border-[#232136]"
            onClick={() => setShowEdit(true)}
          >
            Edit profile
          </button>
          {showEdit && <EditProfile onClose={() => setShowEdit(false)} />}
          <button
            className="bg-[#181024] hover:bg-[#232136] text-white font-semibold px-5 py-2 rounded-md text-base border border-[#232136] transition-all"
            onClick={() => setShowAddProduct(true)}
          >
            Add product
          </button>
          {showAddProduct && (
            <AddProductForm onClose={() => setShowAddProduct(false)} onAdd={() => setShowAddProduct(false)} />
          )}

          {/* Settings Icon */}
          <button
            className="bg-[#181024] hover:bg-[#232136] p-2 rounded-md border border-[#232136] transition-all"
            title="Settings"
            onClick={() => setShowSettings(true)}
          >
            {/* Gear icon, reference: https://www.flaticon.com/free-icon/gear_3524636 */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="32">
              <circle cx="256" cy="256" r="96" stroke="currentColor" strokeWidth="32" fill="none"/>
              <path d="M490.7 273.8c1.1-9.2 1.7-18.5 1.7-27.8s-.6-18.6-1.7-27.8l-54.2-21.3c-4.3-16.6-10.7-32.4-18.9-47.1l25.7-51.7c-13.7-17.1-29.1-32.5-46.2-46.2l-51.7 25.7c-14.7-8.2-30.5-14.6-47.1-18.9L266 21.3C256.8 20.2 247.5 19.6 238.2 19.6s-18.6.6-27.8 1.7l-21.3 54.2c-16.6 4.3-32.4 10.7-47.1 18.9l-51.7-25.7c-17.1 13.7-32.5 29.1-46.2 46.2l25.7 51.7c-8.2 14.7-14.6 30.5-18.9 47.1L21.3 245.8C20.2 255 19.6 264.3 19.6 273.6s.6 18.6 1.7 27.8l54.2 21.3c4.3 16.6 10.7 32.4 18.9 47.1l-25.7 51.7c13.7 17.1 29.1 32.5 46.2 46.2l51.7-25.7c14.7 8.2 30.5-14.6 47.1 18.9l21.3 54.2c9.2 1.1 18.5 1.7 27.8 1.7s18.6-.6 27.8-1.7l21.3-54.2c16.6-4.3 32.4-10.7 47.1-18.9l51.7 25.7c17.1-13.7 32.5-29.1 46.2-46.2l-25.7-51.7c8.2-14.7 14.6-30.5 18.9-47.1l54.2-21.3z" stroke="currentColor" strokeWidth="32" fill="none"/>
            </svg>
          </button>

      {/* Settings Modal - render outside button group for correct layout */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-5xl bg-[#181818] rounded-2xl shadow-2xl border border-[#232136] relative animate-slideIn pointer-events-auto flex flex-col items-center">
            <button
              className="absolute top-6 right-6 text-gray-400 hover:text-[#b39ddb] text-3xl transition-colors duration-150 z-10"
              aria-label="Close"
              onClick={() => setShowSettings(false)}
            >
              &times;
            </button>
            <div className="w-full h-[90vh] flex items-center justify-center">
              <SettingsPanel />
            </div>
          </div>
          <style jsx global>{`
            @keyframes slideIn {
              0% { transform: translateY(100%); opacity: 0; }
              100% { transform: translateY(0); opacity: 1; }
            }
            .animate-slideIn {
              animation: slideIn 0.5s cubic-bezier(0.4,0,0.2,1);
            }
          `}</style>
        </div>
      )}
          {/* Share Icon - bold, rounded, and matches provided reference closely */}
          <button className="bg-[#181024] hover:bg-[#232136] p-2 rounded-md border border-[#232136] transition-all" title="Share">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="40" strokeLinecap="round" strokeLinejoin="round">
              <path d="M120 400 Q 160 320 320 320 L 320 240 L 440 360 L 320 480 L 320 400 Q 120 400 120 400 Z" />
            </svg>
          </button>
        </div>

        <div className="flex gap-6 text-white text-base font-semibold mb-1 w-full justify-center 
        sm:justify-start items-center">
          <span>
            <span className="font-bold">{profile.following}</span>
            <span className="text-white/50"> Following</span>
          </span>

          <span>
            <span className="font-bold">{profile.followers}</span>
            <span className="text-white/50"> Followers</span>
          </span>


          {/* Display total likes with heart icon */}
          <span className="flex items-center gap-1">
            <span className="font-bold text-white ml-1">{profile.likes}</span>
             <span className="text-white/50">Likes</span>
          </span>
        </div>
        <div className="text-[#b39ddb] text-base mt-1 w-full text-center sm:text-left">
          {profile.bio && profile.bio.trim() !== "" ? profile.bio : "No business description provided."}
        </div>
      </div>
    </header>
  );
}
