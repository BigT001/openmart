"use client";

import React, { useState, useRef, useEffect } from "react";
import { SaveButton } from "../ui/SaveButton";
import { useSession } from "next-auth/react";
import { BrandDatePicker } from "../ui/BrandDatePicker";

// Custom styles for date input to override blue highlight and pointer
const dateInputBrandStyle = {
  border: '2px solid #004d40',
  borderRadius: '0.5rem',
  color: '#004d40',
  background: '#fff',
  width: '100%',
  minHeight: 44,
};

// Add global style for date picker calendar icon and selection highlight
if (typeof window !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = `
    input[type="date"]::-webkit-calendar-picker-indicator {
      filter: invert(27%) sepia(99%) saturate(747%) hue-rotate(130deg) brightness(90%) contrast(101%);
    }
    input[type="date"]:focus {
      border-color: #004d40 !important;
      box-shadow: 0 0 0 2px #004d4033 !important;
    }
    input[type="date"]::-webkit-input-placeholder { color: #b0b0b0; }
    input[type="date"]::-moz-placeholder { color: #b0b0b0; }
    input[type="date"]:-ms-input-placeholder { color: #b0b0b0; }
    input[type="date"]::placeholder { color: #b0b0b0; }
    input[type="date"]::-webkit-datetime-edit {
      color: #004d40;
    }
    input[type="date"]::-webkit-datetime-edit-fields-wrapper {
      background: #fff;
    }
    input[type="date"]::-webkit-datetime-edit-text {
      color: #004d40;
    }
    input[type="date"]::-webkit-datetime-edit-month-field,
    input[type="date"]::-webkit-datetime-edit-day-field,
    input[type="date"]::-webkit-datetime-edit-year-field {
      color: #004d40;
    }
    /* Remove blue highlight in Firefox */
    input[type="date"]:focus-visible {
      outline: 2px solid #004d40 !important;
    }
  `;
  document.head.appendChild(style);
}

// InlineDropdown copied from UserSettings/UserPayment for custom dropdowns
function InlineDropdown({ options, value, onChange, placeholder, name }: {
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

function UserAccount() {
  const { data: session } = useSession();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    phone: "",
    dob: "1990-01-01",
    gender: "Male",
    bio: "Passionate seller and buyer. Love connecting with people!",
  });
  const [phoneError, setPhoneError] = React.useState("");
  // Add a state for the date picker value
  const [dobDate, setDobDate] = useState(form.dob ? new Date(form.dob) : null);

  React.useEffect(() => {
    if (session?.user) {
      // Try to split name if available
      let firstName = "";
      let lastName = "";
      if (session.user.name) {
        const parts = session.user.name.split(" ");
        firstName = parts[0] || "";
        lastName = parts.slice(1).join(" ") || "";
      }
      setForm((prev) => ({
        ...prev,
        firstName,
        lastName,
        username: session.user?.name || "",
        email: session.user?.email || "",
      }));
    }
  }, [session]);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value } = e.target;
    if (name === "phone") {
      let val = value.replace(/[^0-9]/g, "");
      if (val.startsWith("0")) {
        setPhoneError("Phone number cannot start with 0.");
      } else if (val.length !== 0 && val.length !== 10) {
        setPhoneError("Phone number must be 10 digits.");
      } else {
        setPhoneError("");
      }
      setForm((prev) => ({ ...prev, [name]: val }));
      return;
    }
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === "dob") setDobDate(value ? new Date(value) : null);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Save logic here
    alert("Profile updated!");
  }

  return (
    <form
      className="w-full max-w-lg mx-auto py-8 px-4 flex flex-col gap-4 text-primary bg-white rounded-xl shadow-lg border border-primary"
      onSubmit={handleSubmit}
    >
      <div className="mb-4 pb-2 flex items-center justify-center gap-3" style={{ borderBottom: '2px solid #004d40' }}>
        <span className="inline-flex items-center justify-center w-12 h-12 rounded-full text-white" style={{ background: '#004d40' }}>
          {/* Modern user icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <circle
              cx="12"
              cy="8"
              r="4"
              stroke="white"
              strokeWidth="2"
              fill="#004d40"
            />
            <path
              d="M4 20c0-3.333 2.667-6 8-6s8 2.667 8 6"
              stroke="white"
              strokeWidth="2"
              fill="none"
            />
          </svg>
        </span>
        <span className="text-2xl font-bold tracking-wide" style={{ color: '#004d40' }}>
          Edit Profile
        </span>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {/* First Name */}
        <div>
          <div className="relative mt-2">
            <span className="absolute left-2 -top-3 px-1 bg-white z-10">
              <label className="text-sm font-semibold text-[#004d40]">First Name</label>
            </span>
            <input
              type="text"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              required
              className="w-full px-4 pt-4 pb-2 focus:outline-none bg-white text-primary text-base"
              style={{ border: '2px solid #004d40', borderRadius: '0.5rem' }}
            />
          </div>
        </div>
        {/* Last Name */}
        <div>
          <div className="relative mt-2">
            <span className="absolute left-2 -top-3 px-1 bg-white z-10">
              <label className="text-sm font-semibold text-[#004d40]">Last Name</label>
            </span>
            <input
              type="text"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              required
              className="w-full px-4 pt-4 pb-2 focus:outline-none bg-white text-primary text-base"
              style={{ border: '2px solid #004d40', borderRadius: '0.5rem' }}
            />
          </div>
        </div>
        {/* Email */}
        <div className="col-span-2">
          <div className="relative mt-2">
            <span className="absolute left-2 -top-3 px-1 bg-white z-10">
              <label className="text-sm font-semibold text-[#004d40]">Email</label>
            </span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 pt-4 pb-2 focus:outline-none bg-white text-primary text-base"
              style={{ border: '2px solid #004d40', borderRadius: '0.5rem' }}
            />
          </div>
        </div>
        {/* Phone Number */}
        <div className="col-span-2">
          <div className="col-span-2 flex gap-2">
            <div className="flex items-end gap-2 w-full">
            
              <div className="flex-1">
                <div className="relative">
                  <span className="absolute left-2 -top-3 px-2 bg-white z-10">
                    <label className="text-sm font-semibold text-[#004d40]">Phone Number</label>
                  </span>
                  <div className="w-full relative" style={{ height: '44px' }}>
                    <span
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-base text-[#004d40] select-none"
                      style={{ pointerEvents: 'none', zIndex: 2, lineHeight: '1.5', height: '22px', display: 'flex', alignItems: 'center' }}
                    >
                      +234
                    </span>
                    <input
                      type="text"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      required
                      className="w-full pl-14 pr-4 focus:outline-none bg-white text-primary text-base"
                      style={{ border: '2px solid #004d40', borderRadius: '0.5rem', height: '44px', lineHeight: '22px', display: 'flex', alignItems: 'center', paddingTop: 0, paddingBottom: 0, minHeight: '44px' }}
                      placeholder="8012345678"
                    />
                  </div>
                  {phoneError && (
                    <span className="text-xs text-red-500 mt-1 block">{phoneError}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
       
      {/* Date of Birth (calendar popup) & Gender (custom dropdown) */}
      <div className="flex flex-row gap-4 w-full mb-2">
        <div className="flex-1 min-w-0">
            <div className="relative mt-2 w-full" style={{ minHeight: '44px' }}>
              <label className="absolute left-3 -top-3 px-1 bg-white text-sm font-semibold text-[#004d40] z-10">Date of Birth</label>
              <div className="w-full" style={{ minHeight: '44px' }}>
                <BrandDatePicker
                  value={dobDate}
                  onChange={date => {
                    setDobDate(date);
                    setForm(prev => ({ ...prev, dob: date ? date.toISOString().slice(0, 10) : "" }));
                  }}
                  name="dob"
                  placeholder="Select Date"
                />
                <style>{`
                  .react-datepicker__input-container input {
                    border: 2px solid #004d40 !important;
                    border-radius: 0.5rem !important;
                    color: #004d40 !important;
                    background: #fff !important;
                    width: 100% !important;
                    min-height: 44px !important;
                    height: 44px !important;
                    padding: 16px 12px 8px 12px !important;
                    font-size: 1rem !important;
                    display: flex !important;
                    align-items: center !important;
                  }
                  .react-datepicker__triangle {
                    display: none !important;
                  }
                  /* Month/Year dropdowns styling */
                  .react-datepicker__month-dropdown-container,
                  .react-datepicker__year-dropdown-container {
                    width: 48%;
                    margin: 0 1%;
                  }
                  .react-datepicker__month-dropdown,
                  .react-datepicker__year-dropdown {
                    background: #F0F4F8 !important;
                    border: 2px solid #004d40 !important;
                    border-radius: 0.5rem !important;
                    color: #004d40 !important;
                    font-size: 1.1rem !important;
                    padding: 8px 0 !important;
                    min-width: 120px !important;
                    box-shadow: 0 2px 8px #004d4033;
                    z-index: 100;
                  }
                  .react-datepicker__month-dropdown .react-datepicker__month-option,
                  .react-datepicker__year-dropdown .react-datepicker__year-option {
                    padding: 8px 16px !important;
                    font-size: 1.1rem !important;
                    color: #004d40 !important;
                    background: #F0F4F8 !important;
                    border-bottom: 1px solid #E0E0E0 !important;
                    cursor: pointer;
                  }
                  .react-datepicker__month-dropdown .react-datepicker__month-option:hover,
                  .react-datepicker__year-dropdown .react-datepicker__year-option:hover {
                    background: #009688 !important;
                    color: #fff !important;
                  }
                  .react-datepicker__header {
                    background: #F0F4F8 !important;
                    border-bottom: 1px solid #004d40 !important;
                  }
                  .react-datepicker__current-month,
                  .react-datepicker__day-name {
                    color: #004d40 !important;
                  }
                  /* Calendar label color (month/year dropdown label) */
                  .react-datepicker__month-read-view,
                  .react-datepicker__year-read-view {
                    color: #004d40 !important;
                    font-weight: 600 !important;
                    font-size: 1.1rem !important;
                  }
                  /* Ensure calendar popup is always above everything */
                  .react-datepicker-popper {
                    z-index: 9999 !important;
                  }
                `}</style>
              </div>
          </div>
        </div>
        <div className="flex-1 min-w-0 mt-2">
          <div className="relative w-full" style={{ minHeight: '44px' }}>
            <label className="absolute left-3 -top-3 px-1 bg-white text-sm font-semibold text-[#004d40] z-10">Gender</label>
            <div className="w-full" style={{ minHeight: '44px' }}>
              <InlineDropdown
                name="gender"
                value={form.gender}
                onChange={val => setForm(prev => ({ ...prev, gender: val }))}
                options={["Male", "Female", "Other"]}
                placeholder="Select Gender"
              />
            </div>
          </div>
        </div>
      </div>
      {/* Bio */}
      <div>
        <div className="relative mt-2">
          <label className="absolute left-3 -top-3 px-1 bg-white text-sm font-semibold text-[#004d40] z-10">Bio</label>
          <textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 pt-4 pb-2 focus:outline-none bg-white text-primary text-base resize-none"
            style={{ border: '2px solid #004d40', borderRadius: '0.5rem' }}
          />
        </div>
      </div>
      {/* Save Button */}
      <div className="flex justify-center mt-4">
        <SaveButton
          type="submit"
          label="Save Changes"
          className="w-full px-6 py-2 text-sm"
        />
      </div>
    </form>
  );
}

export default UserAccount;