// Minimal custom dropdown component
function CustomDropdown({ options, value, onChange, placeholder, name }: {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  name: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div ref={ref} className="relative w-full">
      <button
        type="button"
        className="w-full px-4 border rounded-lg bg-white text-[#004d40] text-left focus:outline-none flex justify-between items-center"
        style={{ border: '2px solid #004d40', minHeight: '44px', height: '44px', paddingTop: 0, paddingBottom: 0, display: 'flex', alignItems: 'center' }}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {value || <span className="text-gray-400">{placeholder}</span>}
        <svg className="w-4 h-4 ml-2 text-[#004d40]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
      </button>
      {open && (
        <ul
          className="absolute left-0 right-0 bottom-full mb-1 bg-white border border-[#004d40] rounded-lg shadow-lg z-20 max-h-72 overflow-auto"
          style={{ color: '#004d40' }}
          tabIndex={-1}
          role="listbox"
        >
          {options.length === 0 && (
            <li className="px-4 py-2 text-gray-400">No options</li>
          )}
          {options.map((opt) => (
            <li
              key={opt}
              className={`px-4 py-2 cursor-pointer transition ${value === opt ? 'bg-[#004d40] text-white' : 'hover:bg-[#004d40] hover:text-white'}`}
              style={{ borderBottom: '1px solid #F0F4F8' }}
              onClick={() => { onChange(opt); setOpen(false); }}
              role="option"
              aria-selected={value === opt}
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
import React, { useRef, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiX, FiUser, FiMapPin, FiCreditCard } from "react-icons/fi";
import UserAccount from "./UserAccount";
import UserPayment from "./UserPayment";
import { SaveButton } from "../ui/SaveButton";

import { statesAndLocalGvt } from "../../lib/statesAndLocalGvt";

const initialAddress = {
  firstName: "",
  lastName: "",
  phonePrefix: "+234",
  phone: "",
  additionalPhonePrefix: "+234",
  additionalPhone: "",
  deliveryAddress: "",
  additionalInfo: "",
  state: "",
  localGovernment: "",
};

export default function UserSettings({ onClose }: { onClose: () => void }) {
  // Custom style for select option hover/selected color
  const selectOptionStyle = `
    select option:checked, select option:hover, select option:focus {
      background: #004d40 !important;
      color: #fff !important;
    }
  `;
  const modalRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<number>(
    Number(localStorage.getItem("userSettingsActiveTab")) || 1
  );
  const [activePaymentTab, setActivePaymentTab] = useState<number>(
    Number(localStorage.getItem("userSettingsActivePaymentTab")) || 0
  );
  const [address, setAddress] = useState(initialAddress);
  const [localOptions, setLocalOptions] = useState<string[]>([]);
  useEffect(() => {
    if (address.state) {
      const found = statesAndLocalGvt.find(s => s.name === address.state);
      setLocalOptions(found ? found.locals : []);
    } else {
      setLocalOptions([]);
    }
  }, [address.state]);

  useEffect(() => {
    localStorage.setItem("userSettingsActiveTab", String(activeTab));
  }, [activeTab]);

  useEffect(() => {
    localStorage.setItem("userSettingsActivePaymentTab", String(activePaymentTab));
  }, [activePaymentTab]);

  const handleTabChange = (tab: number) => setActiveTab(tab);
  const handlePaymentTabChange = (tab: number) => setActivePaymentTab(tab);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };
  // For custom dropdowns
  const handleCustomChange = (name: string, value: string) => {
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // Save logic here
    onClose();
  };

  return (
    <>
      <style>{selectOptionStyle}</style>
      <div
        ref={modalRef}
        className="relative w-full max-w-md flex flex-col bg-white text-[#004d40] rounded-2xl shadow-2xl p-0 border overflow-hidden"
        style={{ height: 'auto', minHeight: '400px', border: '2px solid #004d40' }}
      >
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-[#6C3FC6] transition text-2xl"
          onClick={onClose}
          aria-label="Close settings"
        >
          <FiX />
        </button>
        <div className="w-full flex flex-col items-center justify-center pt-6 pb-2 px-6">
          <h2 className="text-xl font-bold mb-2 flex items-center gap-2 tracking-tight text-[#004d40]">
            <FiUser className="w-6 h-6 text-[#004d40]" />
            Settings
          </h2>
          <div className="flex gap-1 mb-3 border-b pb-1 w-full justify-center sticky top-0 z-10" style={{ borderBottom: '1px solid #004d40' }}>
            <button
              className={`px-3 py-1 rounded-t-lg flex items-center gap-2 text-sm font-semibold transition shadow-sm ${
                activeTab === 1
                  ? "bg-[#004d40] text-white shadow-lg"
                  : "bg-white text-[#004d40] hover:bg-[#004d40]/10"
              }`}
              onClick={() => handleTabChange(1)}
              style={{ minWidth: 90 }}
            >
              <FiMapPin className="w-4 h-4" /> Address
            </button>
            <button
              className={`px-3 py-1 rounded-t-lg flex items-center gap-2 text-sm font-semibold transition shadow-sm ${
                activeTab === 2
                  ? "bg-[#004d40] text-white shadow-lg"
                  : "bg-white text-[#004d40] hover:bg-[#004d40]/10"
              }`}
              onClick={() => handleTabChange(2)}
              style={{ minWidth: 90 }}
            >
              <FiCreditCard className="w-4 h-4" /> Payment
            </button>
          </div>
        </div>
        <div className="flex-1 w-full px-2 pb-6">
          {activeTab === 0 && <UserAccount />}
          {activeTab === 1 && (
            <form className="space-y-3 text-[#004d40]" onSubmit={handleSave}>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <div className="relative mt-4">
                    <label className="absolute left-3 -top-3 px-1 bg-white text-sm font-semibold text-[#004d40] z-10">Delivery Address</label>
                    <input
                      type="text"
                      name="deliveryAddress"
                      value={address.deliveryAddress}
                      onChange={handleChange}
                      required
                      className="w-full px-4 pt-3 pb-2 border rounded-lg focus:outline-none bg-white text-[#004d40] text-base"
                      style={{ border: '2px solid #004d40' }}
                      placeholder="Street, house number, etc."
                    />
                  </div>
                </div>
                <div className="col-span-2">
                  <div className="relative mt-4">
                    <label className="absolute left-3 -top-3 px-1 bg-white text-sm font-semibold text-[#004d40] z-10">Additional Information</label>
                    <textarea
                      name="additionalInfo"
                      value={address.additionalInfo}
                      onChange={handleChange}
                      className="w-full px-4 pt-3 pb-2 border rounded-lg focus:outline-none bg-white text-[#004d40] text-base resize-none"
                      style={{ border: '2px solid #004d40', minHeight: "80px" }}
                      placeholder="Landmark, notes, etc."
                      rows={4}
                    />
                  </div>
                </div>
                <div className="col-span-1">
                  <div className="relative mt-4">
                    <label className="absolute left-3 -top-3 px-1 bg-white text-sm font-semibold text-[#004d40] z-10">State</label>
                    <CustomDropdown
                      name="state"
                      value={address.state}
                      onChange={(val) => handleCustomChange('state', val)}
                      options={statesAndLocalGvt.map((state) => state.name)}
                      placeholder="Select State"
                    />
                  </div>
                </div>
                <div className="col-span-1">
                  <div className="relative mt-4">
                    <label className="absolute left-3 -top-3 px-1 bg-white text-sm font-semibold text-[#004d40] z-10">Local Government</label>
                    <CustomDropdown
                      name="localGovernment"
                      value={address.localGovernment}
                      onChange={(val) => handleCustomChange('localGovernment', val)}
                      options={localOptions}
                      placeholder="Select Local Gvt"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-3 flex justify-end">
                <SaveButton type="submit" className="w-full text-xs font-bold" label="Save" />
              </div>
            </form>
          )}
          {activeTab === 2 && (
            <div className="w-full">
              {/* Payment section without tabs */}
              <UserPayment />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
