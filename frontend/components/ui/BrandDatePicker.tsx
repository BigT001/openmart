import React from "react";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";

interface BrandDatePickerProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  name?: string;
  placeholder?: string;
}

export const BrandDatePicker: React.FC<BrandDatePickerProps> = ({ value, onChange, name, placeholder }) => {
  return (
    <DatePicker
      selected={value}
      onChange={onChange}
      name={name}
      placeholderText={placeholder}
      dateFormat="yyyy-MM-dd"
      className="w-full px-4 pt-4 pb-2 focus:outline-none bg-white text-base border-2 rounded-lg"
      calendarClassName="brand-datepicker-calendar"
      popperClassName="brand-datepicker-popper"
      wrapperClassName="w-full"
      showMonthDropdown
      showYearDropdown
      dropdownMode="select"
    />
  );
};

// Custom styles for the calendar popup
// You can add this to your global CSS or inject via a <style> tag in _app.tsx
// .brand-datepicker-calendar .react-datepicker__day--selected,
// .brand-datepicker-calendar .react-datepicker__day--keyboard-selected,
// .brand-datepicker-calendar .react-datepicker__day:hover {
//   background: #004d40 !important;
//   color: #fff !important;
// }
// .brand-datepicker-calendar .react-datepicker__header {
//   background: #F0F4F8 !important;
//   border-bottom: 1px solid #004d40 !important;
// }
// .brand-datepicker-calendar .react-datepicker__current-month,
// .brand-datepicker-calendar .react-datepicker__day-name {
//   color: #004d40 !important;
// }
