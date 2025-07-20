import React from "react";

interface LikeButtonProps {
  liked: boolean;
  count: number;
  loading?: boolean;
  onClick: () => void;
  className?: string;
  countClassName?: string;
  buttonAriaLabel?: string;
}

const LikeButton: React.FC<LikeButtonProps> = ({
  liked,
  count,
  loading = false,
  onClick,
  className = "",
  countClassName = "",
  buttonAriaLabel = "Like",
}) => {
  return (
    <div className="relative inline-block">
      <button
        className={`w-9 h-9 flex items-center justify-center rounded-full border-none bg-transparent shadow-none transition hover:scale-110 focus:outline-none ${className}`}
        onClick={onClick}
        disabled={loading}
        aria-label={buttonAriaLabel}
        tabIndex={0}
        type="button"
      >
        <svg
          className={`w-6 h-6 transition-colors duration-200 ${liked ? "text-pink-500 fill-pink-500" : "text-gray-400 fill-none"}`}
          viewBox="0 0 24 24"
          fill={liked ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 21C12 21 4 13.28 4 8.5C4 5.42 6.42 3 9.5 3C11.24 3 12.91 3.81 14 5.08C15.09 3.81 16.76 3 18.5 3C21.58 3 24 5.42 24 8.5C24 13.28 16 21 16 21H12Z" />
        </svg>
      </button>
      <span
        className={`absolute left-1/2 -translate-x-1/2 top-10 w-9 text-xs font-bold text-[#b39ddb] select-none pointer-events-none text-center ${countClassName}`}
        style={{ zIndex: 20 }}
      >
        {count}
      </span>
    </div>
  );
};

export default LikeButton;
