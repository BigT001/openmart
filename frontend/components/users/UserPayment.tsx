"use client";

import React from "react";
import CardOne from "../cardComponent/CardOne";
import { SaveButton } from "../ui/SaveButton";

export default function UserPayment() {
  const [activeTab, setActiveTab] = React.useState('card');
  return (
    <div className="w-full max-w-lg mx-auto py-4 px-4 text-[#004d40]">
      <div className="flex items-center mb-2 gap-0 border-b border-[#004d40] relative">
        <button
          className={`px-3 py-2 text-sm font-semibold focus:outline-none border-b-2 
            transition-colors duration-150 ${activeTab === 'card' ? 'border-[#004d40] text-[#004d40] bg-transparent' : 
              'border-transparent text-[#004d40] bg-transparent hover:text-[#009688]'}`}
          onClick={() => setActiveTab('card')}
          style={{ minWidth: 60 }}
        >
          Card
        </button>
        <button
          className={`px-3 py-2 text-sm font-semibold focus:outline-none border-b-2 
            transition-colors duration-150 ${activeTab === 'bank' ? 'border-[#004d40] text-[#004d40] bg-transparent' : 
              'border-transparent text-[#004d40] bg-transparent hover:text-[#009688]'}`}
          onClick={() => setActiveTab('bank')}
          style={{ minWidth: 60 }}
        >
          Bank
        </button>
        <div className="flex-1" />
        <button
          className="absolute right-0 top-0 flex items-center gap-1 p-2 text-[#004d40] hover:text-[#004d40] focus:outline-none font-semibold"
          aria-label="Add Card"
        >
          Add Card
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="9" cy="9" r="8" stroke="#004d40" strokeWidth="2" fill="none" />
            <path d="M9 5v8M13 9H5" stroke="#004d40" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>
      {/* Card section - no box */}
      {activeTab === 'card' && (
        <div className="flex flex-col items-center w-full mt-6">
          <CardOne />
          <div className="w-full" style={{ marginTop: '2.5rem' }}>
            <SaveButton className="w-full" label="Save Payment" />
          </div>
        </div>
      )}
      {/* Bank section - styled with brand colors */}
      {activeTab === 'bank' && (
        <div className="flex flex-col items-center gap-2 w-full mt-6">
          <h3 className="text-lg font-bold text-[#004d40] mb-2">Bank Details</h3>
          <div className="w-full max-w-sm bg-[#F0F4F8] rounded-lg p-4 text-[#004d40] border border-[#004d40]">
            <div className="mb-2">
              <span className="block text-sm font-semibold">Account Name:</span>
              <span className="block text-base font-bold">John Doe</span>
            </div>
            <div className="mb-2">
              <span className="block text-sm font-semibold">Account Number:</span>
              <span className="block text-base font-bold">0123456789</span>
            </div>
            <div className="mb-2">
              <span className="block text-sm font-semibold">Bank Name:</span>
              <span className="block text-base font-bold">OpenMart Bank</span>
            </div>
          </div>
          <div className="w-full mt-10">
            <SaveButton className="w-full" label="Save Bank Details" />
          </div>
        </div>
      )}
    </div>
  );
}
