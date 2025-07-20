"use client";

import { useState } from "react";

// Import your modular section components here
// import PersonalInfoSection from "./settings/PersonalInfoSection";
// import VendorProfileSection from "./settings/VendorProfileSection";
// import BankDetailsSection from "./settings/BankDetailsSection";
// import SocialMediaSection from "./settings/SocialMediaSection";
// ...etc

const SECTIONS = [
  { key: "personal", label: "Personal Info", icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg> },
  { key: "vendor", label: "Business Profile", icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 17a5 5 0 100-10 5 5 0 000 10zm7-5a7 7 0 11-14 0 7 7 0 0114 0zm-7 4v4m0 0h4m-4 0H8" /></svg> },
  { key: "bank", label: "Bank", icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 10l9-7 9 7v7a2 2 0 01-2 2H5a2 2 0 01-2-2v-7z" /></svg> },
  { key: "social", label: "Social Media", icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8h2a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2v-8a2 2 0 012-2h2m10 0V6a4 4 0 00-8 0v2m8 0H7" /></svg> },
  { key: "privacy", label: "Privacy", icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" /><path strokeLinecap="round" strokeLinejoin="round" d="M8 12a4 4 0 018 0" stroke="currentColor" strokeWidth="2" /><circle cx="12" cy="10" r="2" fill="currentColor" /></svg> },
  // Add more as needed
];

export default function SettingsPanel() {
  const [activeSection, setActiveSection] = useState(SECTIONS[0].key);

  return (
    <div className="flex flex-row gap-8 min-h-[600px] w-full">
      {/* Sidebar Card */}
      <div className="rounded-2xl bg-[#181818] border border-[#232323] shadow-xl w-64 flex flex-col py-8 gap-2 h-fit self-start">
        {SECTIONS.map((section) => (
          <button
            key={section.key}
            className={`flex items-center gap-3 px-6 py-3 rounded-lg transition-colors text-left ${activeSection === section.key ? 'bg-[#232323] text-[#b39ddb]' : 'hover:bg-[#232323] text-white'}`}
            onClick={() => setActiveSection(section.key)}
          >
            <span>{section.icon}</span>
            <span className="text-base font-semibold">{section.label}</span>
          </button>
        ))}
      </div>
      {/* Main Content Card */}
      <div className="flex-1 rounded-2xl bg-[#181818] border border-[#232323] shadow-xl p-10 flex flex-col gap-0">
        {/* Render the selected section component here */}
        {activeSection === "personal" && (
          <div className="animate-fadein">
            {/* <PersonalInfoSection /> */}
            <div className="text-white text-2xl font-bold mb-4">Personal Info</div>
            <div className="bg-[#232323] rounded-xl p-8 shadow-lg">
              <div className="text-gray-300">This is where your personal info form/component goes.</div>
            </div>
          </div>
        )}
        {activeSection === "vendor" && (
          <div className="animate-fadein">
            {/* <VendorProfileSection /> */}
            <div className="text-white text-2xl font-bold mb-4">Vendor Profile</div>
            <div className="bg-[#232323] rounded-xl p-8 shadow-lg">
              <div className="text-gray-300">This is where your vendor profile form/component goes.</div>
            </div>
          </div>
        )}
        {activeSection === "bank" && (
          <div className="animate-fadein">
            {/* <BankDetailsSection /> */}
            <div className="text-white text-2xl font-bold mb-4">Bank Details</div>
            <div className="bg-[#232323] rounded-xl p-8 shadow-lg">
              <div className="text-gray-300">This is where your bank details form/component goes.</div>
            </div>
          </div>
        )}
        {activeSection === "social" && (
          <div className="animate-fadein">
            {/* <SocialMediaSection /> */}
            <div className="text-white text-2xl font-bold mb-4">Social Media</div>
            <div className="bg-[#232323] rounded-xl p-8 shadow-lg">
              <div className="text-gray-300">This is where your social media form/component goes.</div>
            </div>
          </div>
        )}
        {/* Add more sections as needed */}
      </div>
    </div>
  );
}

function SidebarItem({ icon, label, active }: { icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <div className={`flex items-center gap-3 px-6 py-3 cursor-pointer rounded-lg transition-colors ${active ? 'bg-[#232323]' : 'hover:bg-[#232323]'}` }>
      <span className={`text-xl ${active ? 'text-[#ff2d55]' : 'text-white'}`}>{icon}</span>
      <span className={`text-base font-semibold ${active ? 'text-[#ff2d55]' : 'text-white'}`}>{label}</span>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-2xl font-bold text-white mb-4 mt-2">{children}</h2>;
}
