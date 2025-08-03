import React, { useRef, useEffect, useState } from "react";

interface CustomDropdownProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  name: string;
}

export function CustomDropdown({ options, value, onChange, placeholder, name }: CustomDropdownProps) {
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
        className="w-full pt-5 pb-3 px-4 border rounded-lg bg-white text-[#004d40] text-left focus:outline-none flex justify-between items-center"
        style={{ border: '1px solid #004d40', minHeight: 44 }}
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
