"use client";

import React, { useState, useEffect, useRef } from "react";
import UserSettings from "./UserSettings";
import { motion, AnimatePresence } from "framer-motion";
import UserAccount from "./UserAccount";
import { useSession } from "next-auth/react";
import CartPage from "../cart/cart";

interface UserProfile {
  imageUrl: string;
  name: string;
  subtitle: string;
  following: number;
  followers: number;
  likes: number;
  bio: string;
}

type SettingsModalBelowHeaderProps = {
  headerRef: React.RefObject<HTMLElement | null>;
  onClose: () => void;
};

function SettingsModalBelowHeader({
  headerRef,
  onClose,
}: SettingsModalBelowHeaderProps) {
  const [position, setPosition] = useState<{
    top: number;
    left: number;
    width: number;
  }>({ top: 0, left: 0, width: 420 });
  useEffect(() => {
    if (headerRef.current) {
      const rect = headerRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + rect.width / 2 + window.scrollX,
        width: rect.width < 420 ? rect.width : 420,
      });
    }
  }, [headerRef]);
  return (
    <motion.div
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -40, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed z-50 flex items-start justify-center"
      style={{
        top: position.top,
        left: position.left,
        transform: "translateX(-50%)",
        width: position.width,
        background: "transparent",
      }}
    >
      <div className="relative w-full max-w-md h-[700px] flex flex-col ">
        <UserSettings onClose={onClose} />
      </div>
    </motion.div>
  );
}

export default function UsersHeader() {
  const headerRef = useRef<HTMLElement>(null);
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEdit, setShowEdit] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showCart, setShowCart] = useState(false);

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
        const API_URL =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        const res = await fetch(
          `${API_URL}/api/users/by-email?email=${encodeURIComponent(
            session.user.email
          )}`
        );
        const data = await res.json();
        if (data.user_profile) {
          setProfile({
            imageUrl:
              data.user_profile.imageUrl ||
              session.user.image ||
              "/profile.jpg",
            name:
              data.user_profile.name ||
              session.user.name ||
              session.user.email ||
              "User Name",
            subtitle: data.user_profile.subtitle || "",
            following: data.user_profile.following || 0,
            followers: data.user_profile.followers || 0,
            likes: data.user_profile.likes || 0,
            bio: data.user_profile.bio || "",
          });
        } else {
          setProfile({
            imageUrl: session.user.image || "/profile.jpg",
            name: session.user.name || session.user.email || "User Name",
            subtitle: "",
            following: 0,
            followers: 0,
            likes: 0,
            bio: "",
          });
        }
      } catch (err: any) {
        setError("Failed to load user profile");
      } finally {
        setLoading(false);
      }
    };
    if (status === "authenticated") fetchProfile();
  }, [session, status]);

  if (loading) {
    return (
      <div className="w-full flex justify-center items-center py-8 text-gray-400">
        Loading user profile...
      </div>
    );
  }
  if (error || !profile) {
    return (
      <div className="w-full flex justify-center items-center py-8 text-red-500">
        {error || "Profile not found"}
      </div>
    );
  }

  return (
    <header
      ref={headerRef}
      className="rounded-2xl text-[#004d40] bg-[#F0F4F8] border-b-4 border-[#009688] mx-auto flex flex-col items-center justify-center px-8 py-6"
      style={{ width: "fit-content", minWidth: 340 }}
    >
      <div className="flex flex-row items-center justify-center gap-8">
        {/* Profile Image */}
        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden flex-shrink-0 border-4 border-[#004d40] relative group bg-[#F0F4F8]">
          <input
            type="file"
            accept="image/*"
            id="user-profile-upload"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                  const img = document.getElementById(
                    "user-profile-img"
                  ) as HTMLImageElement;
                  if (img && event.target?.result) {
                    img.src = event.target.result as string;
                  }
                };
                reader.readAsDataURL(file);
              }
            }}
          />
          <img
            id="user-profile-img"
            src={profile.imageUrl}
            alt={profile.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#009688]/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
            <span className="text-[#004d40] font-semibold text-sm">
              Upload Image
            </span>
          </div>
        </div>

        {/* Profile Info */}
        <div className="flex flex-col items-start justify-center min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#004d40] leading-tight">
              {profile.name || "User Name"}
            </span>
            <span className="text-base sm:text-lg text-[#009688] font-normal whitespace-nowrap">
              {profile.subtitle}
            </span>
          </div>
          <div className="flex flex-wrap gap-2 mt-3 mb-3 justify-start items-center">
            {/* Cart Button */}
            <button
              className="bg-[#004d40] hover:bg-[#009688] text-white font-semibold px-5 py-2 rounded-md text-base border border-[#004d40] transition-all"
              onClick={() => setShowCart(true)}
            >
              Cart
            </button>
            <AnimatePresence>
              {showCart && (
                <motion.div
                  initial={{ x: -400, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -400, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="fixed top-0 left-[288px] z-50 flex items-start justify-start"
                  style={{
                    width: "calc(100vw - 288px - 2px)", // 2px right margin for maximum width
                    height: "100vh",
                    background: "transparent",
                    color: "#004d40",
                    paddingRight: 2,
                  }}
                >
                  <div
                    className="relative w-full flex flex-col mx-auto"
                    style={{ minHeight: 0, height: "auto" }}
                  >
                    <button
                      className="absolute top-4 left-4 flex items-center gap-2 text-[#009688] hover:text-[#004d40] font-semibold text-base px-3 py-1 rounded transition"
                      onClick={() => setShowCart(false)}
                      aria-label="Back"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.75 19.5L8.25 12l7.5-7.5"
                        />
                      </svg>
                      Back
                    </button>
                    <div className="pt-12 px-2 pb-2 w-full">
                      <CartPage onBack={() => setShowCart(false)} />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Edit Profile Button */}
            <button
              className="bg-[#009688] hover:bg-[#004d40] text-white font-bold px-5 py-2 rounded-md text-base transition-all border border-[#009688]"
              onClick={() => setShowEdit(true)}
            >
              Edit profile
            </button>
            <AnimatePresence>
              {showEdit && (
                <motion.div
                  initial={{ x: -400, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -400, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="fixed top-0 left-[288px] z-50 flex items-center justify-start"
                  style={{
                    width: "420px",
                    height: "100vh",
                    background: "transparent",
                  }}
                >
                  <div className="relative w-full max-w-md h-[700px] flex flex-col ">
                    <button
                      className="absolute top-4 left-4 flex items-center gap-2 text-[#009688] hover:text-[#004d40] font-semibold text-base px-3 py-1 rounded transition"
                      onClick={() => setShowEdit(false)}
                      aria-label="Back"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.75 19.5L8.25 12l7.5-7.5"
                        />
                      </svg>
                      Back
                    </button>
                    <div className="pt-12 px-2 pb-2 w-full">
                      <UserAccount />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Settings Icon */}
            <button
              className="bg-[#009688] hover:bg-[#004d40] p-2 rounded-md border  transition-all"
              title="Settings"
              onClick={() => setShowSettings(true)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth="32"
              >
                <circle
                  cx="256"
                  cy="256"
                  r="96"
                  stroke="currentColor"
                  strokeWidth="32"
                  fill="none"
                />
                <path
                  d="M490.7 273.8c1.1-9.2 1.7-18.5 1.7-27.8s-.6-18.6-1.7-27.8l-54.2-21.3c-4.3-16.6-10.7-32.4-18.9-47.1l25.7-51.7c-13.7-17.1-29.1-32.5-46.2-46.2l-51.7 25.7c-14.7-8.2-30.5-14.6-47.1-18.9L266 21.3C256.8 20.2 247.5 19.6 238.2 19.6s-18.6.6-27.8 1.7l-21.3 54.2c-16.6 4.3-32.4 10.7-47.1 18.9l-51.7-25.7c-17.1 13.7-32.5 29.1-46.2 46.2l25.7 51.7c-8.2 14.7-14.6 30.5-18.9 47.1L21.3 245.8C20.2 255 19.6 264.3 19.6 273.6s.6 18.6 1.7 27.8l54.2 21.3c4.3 16.6 10.7 32.4 18.9 47.1l-25.7 51.7c13.7 17.1 29.1 32.5 46.2 46.2l51.7-25.7c14.7 8.2 30.5-14.6 47.1 18.9l21.3 54.2c9.2 1.1 18.5 1.7 27.8 1.7s18.6-.6 27.8-1.7l21.3-54.2c16.6-4.3 32.4-10.7 47.1-18.9l51.7 25.7c17.1-13.7 32.5-29.1 46.2-46.2l-25.7-51.7c8.2-14.7 14.6-30.5 18.9-47.1l54.2-21.3z"
                  stroke="currentColor"
                  strokeWidth="32"
                  fill="none"
                />
              </svg>
            </button>
            <AnimatePresence>
              {showSettings && (
                <motion.div
                  initial={{ x: -400, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -400, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="fixed top-0 left-[288px] z-50 flex items-center justify-start"
                  style={{
                    width: "420px",
                    height: "100vh",
                    background: "transparent",
                  }}
                >
                  <div className="relative w-full max-w-md h-[700px] flex flex-col ">
                    <button
                      className="absolute top-4 left-4 flex items-center gap-2 text-[#009688] hover:text-[#004d40] font-semibold text-base px-3 py-1 rounded transition"
                      onClick={() => setShowSettings(false)}
                      aria-label="Back"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.75 19.5L8.25 12l7.5-7.5"
                        />
                      </svg>
                      Back
                    </button>
                    <div className="pt-12 px-2 pb-2 w-full">
                      <UserSettings onClose={() => setShowSettings(false)} />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="flex gap-6 text-[#004d40] text-base font-semibold mb-1 justify-start items-center">
            <span>
              <span className="font-bold">{profile.following}</span>
              <span className="text-[#009688]"> Following</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="font-bold text-[#009688] ml-1">
                {profile.likes}
              </span>
              <span className="text-[#009688]">Likes</span>
            </span>
            <span>
              <span className="font-bold">{profile.followers}</span>
              <span className="text-[#009688]"> Dislikes</span>
            </span>
          </div>
          <div className="text-[#009688] text-base mt-1 text-left">
            {profile.bio && profile.bio.trim() !== ""
              ? profile.bio
              : "No bio provided."}
          </div>
        </div>
      </div>
    </header>
  );
}
