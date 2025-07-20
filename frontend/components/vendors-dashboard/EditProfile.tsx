"use client";

import React, { useState } from "react";


interface EditProfileProps {
  onClose?: () => void;
}

export default function EditProfile({ onClose }: EditProfileProps) {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  // Close on click outside
  React.useEffect(() => {
    function handleClick(e: MouseEvent) {
      const modal = document.getElementById("edit-profile-modal");
      if (modal && !modal.contains(e.target as Node)) {
        onClose && onClose();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setProfilePhoto(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div
        id="edit-profile-modal"
        className="relative w-full max-w-md bg-[#181818] rounded-2xl shadow-2xl border border-[#232323] p-6 animate-slideIn pointer-events-auto flex flex-col items-center"
        style={{ margin: 'auto' }}
      >
        <button
          className="absolute top-5 right-5 text-gray-400 hover:text-[#b39ddb] text-2xl transition-colors duration-150 z-10"
          aria-label="Close"
          onClick={onClose}
        >
          &times;
        </button>
        <div className="w-full flex flex-col items-center px-2 pt-2 pb-2">
          <h2 className="text-2xl font-bold mb-6 text-white w-full text-center">Edit Profile</h2>
          {/* Profile photo */}
          <div className="flex flex-col items-center mb-7 w-full">
            <div className="relative">
              <div className="w-28 h-28 rounded-full bg-[#232323] border-2 border-[#b39ddb]/40 flex items-center justify-center text-4xl font-bold select-none overflow-hidden shadow-md">
                {profilePhoto ? (
                  <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover rounded-full" />
                ) : (
                  <span className="text-[#b39ddb]">S</span>
                )}
              </div>
              <label htmlFor="profile-photo-upload" className="absolute bottom-2 right-2 bg-[#b39ddb] border border-white rounded-full p-1.5 cursor-pointer hover:bg-[#7c4dff] shadow-md transition-colors duration-150">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-white">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652l-1.688 1.687M7.5 10.5l6 6m0 0l3.75-3.75m-3.75 3.75V21a.75.75 0 01-.75.75h-6A2.25 2.25 0 013 19.5v-6a.75.75 0 01.75-.75h6m3.75 3.75l-6-6" />
                </svg>
                <input id="profile-photo-upload" type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
              </label>
            </div>
          </div>
          {/* Username */}
          <div className="mb-5 w-full">
            <label className="block text-sm font-semibold mb-1 text-white" htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              className="w-full bg-[#232323] border border-[#232323] focus:border-[#b39ddb]/40 rounded-lg px-4 py-2 text-white placeholder-gray-400 text-sm shadow-sm"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="samuel.stanley69"
            />
            <div className="text-xs text-gray-400 mt-1">www.tiktok.com/@{username || "samuel.stanley69"}</div>
            <div className="text-xs text-gray-500 mt-1">Usernames can only contain letters, numbers, underscores, and periods. Changing your username will also change your profile link.</div>
          </div>
          {/* Name */}
          <div className="mb-5 w-full">
            <label className="block text-sm font-semibold mb-1 text-white" htmlFor="name">Business Name</label>
            <input
              id="name"
              type="text"
              className="w-full bg-[#232323] border border-[#232323] focus:border-[#b39ddb]/40 rounded-lg px-4 py-2 text-white placeholder-gray-400 text-sm shadow-sm"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Samuel Stanley"
            />
            <div className="text-xs text-gray-500 mt-1">Your business name can only be changed once every 7 days.</div>
          </div>
          {/* Bio */}
          <div className="mb-7 w-full">
            <label className="block text-sm font-semibold mb-1 text-white" htmlFor="bio">Business Description</label>
            <textarea
              id="bio"
              className="w-full bg-[#232323] border border-[#232323] focus:border-[#b39ddb]/40 rounded-lg px-4 py-2 text-white placeholder-gray-400 text-sm shadow-sm resize-none"
              value={bio}
              onChange={e => setBio(e.target.value)}
              maxLength={80}
              rows={3}
              placeholder="Describe your business..."
            />
            <div className="text-xs text-gray-400 mt-1">{bio.length}/80</div>
          </div>
          {/* Actions */}
          <div className="flex justify-end gap-2 w-full mt-2">
            <button
              className="px-6 py-2 rounded-lg bg-[#232323] text-white font-bold border border-[#232323] hover:bg-[#181818] transition text-sm"
              type="button"
              onClick={onClose}
            >
              Cancel
            </button>
            <button className="px-6 py-2 rounded-lg bg-[#b39ddb] text-white font-bold shadow hover:bg-[#7c4dff] border border-[#b39ddb]/40 focus:outline-none focus:ring-2 focus:ring-[#b39ddb]/30 transition disabled:opacity-60 text-sm" type="button">Save</button>
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
    </div>
  );
}
