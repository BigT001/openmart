'use client';

import React, { useState } from "react";
import UsersHeader from "@/components/users/UsersHeader";
import UsersSidebar from "@/components/users/UsersSidebar";

export default function UsersPage() {
  // Tab state: 0 = Posts, 1 = Favorites, 2 = Liked, 3 = Inbox, 4 = Reviews
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="flex min-h-screen bg-[#F0F4F8]">
      <UsersSidebar active={activeTab} />
      <div className="flex-1 flex flex-col items-center">
        <div className="flex justify-center items-center w-full">
          <UsersHeader />
        </div>
        {/* Tab bar */}
        <div className="flex items-center px-4 md:px-8 mb-8 mt-4 w-full" style={{ background: 'transparent' }}>
          <div className="flex items-center gap-0 md:gap-2">
            {[{icon:'▦',label:'Wishlist'},{icon:'☆',label:'Favorites'},{icon:'♡',label:'Liked'},{icon:'📥',label:'Recently Viewed'}].map((tab, idx) => (
              <button
                key={tab.label}
                className={`group flex items-center gap-2 px-4 py-2 font-semibold focus:outline-none transition-all duration-300 relative border-none bg-transparent ${activeTab === idx ? 'text-[#009688]' : 'text-[#004d40] hover:text-[#009688]'}`}
                onClick={() => setActiveTab(idx)}
                style={{ background: 'transparent' }}
              >
                <span className={`text-xl transition-colors duration-300 ${activeTab === idx ? 'text-[#009688]' : 'text-[#009688] group-hover:text-[#009688]'}`}>{tab.icon}</span> {tab.label}
                {activeTab === idx && (
                  <span className="absolute left-2 right-2 bottom-0 h-0.5 bg-[#009688] rounded transition-all duration-300" style={{}}></span>
                )}
              </button>
            ))}
          </div>
          <div className="flex-1"></div>
          <div className="flex items-center gap-0 md:gap-2">
            <button
              className={`group px-4 py-2 font-semibold focus:outline-none transition-all duration-300 relative border-none bg-transparent ${activeTab === 4 ? 'text-[#009688]' : 'text-[#004d40] hover:text-[#009688]'}`}
              onClick={() => setActiveTab(4)}
              style={{ background: 'transparent' }}
            >
              Reviews
              {activeTab === 4 && (
                <span className="absolute left-2 right-2 bottom-0 h-0.5 bg-[#009688] rounded transition-all duration-300" style={{}}></span>
              )}
            </button>
          </div>
        </div>
        {/* Tab Content */}
        <div className="px-4 md:px-8 mt-4">
          {activeTab === 0 && (
            <div className="text-[#009688] text-center mt-16">No posts yet.</div>
          )}
          {activeTab === 1 && (
            <div className="text-[#009688] text-center mt-16">No favorites yet.</div>
          )}
          {activeTab === 2 && (
            <div className="text-[#009688] text-center mt-16">No liked posts yet.</div>
          )}
          {activeTab === 3 && (
            <div className="text-[#009688] text-center mt-16">No inbox messages yet.</div>
          )}
          {activeTab === 4 && (
            <div className="text-[#009688] text-center mt-16">No reviews yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}