import React from 'react';

interface Props {
  className?: string;
  size?: number;
}

export const Logo: React.FC<Props> = ({ className = 'w-7 h-7', size = 28 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Somali Super Toolkit Logo"
    >
      {/* Outer base container */}
      <rect x="2" y="2" width="28" height="28" rx="4" fill="#0A2342" />
      
      {/* Precision grid divider lines */}
      <line x1="16" y1="5" x2="16" y2="27" stroke="#1E88E5" strokeWidth="1.5" strokeOpacity="0.4" />
      <line x1="5" y1="16" x2="27" y2="16" stroke="#1E88E5" strokeWidth="1.5" strokeOpacity="0.4" />
      
      {/* Minimalist tools intersection: caliper / square rule / compass node */}
      <rect x="6.5" y="6.5" width="6" height="6" rx="1.5" fill="#1E88E5" />
      <path d="M19.5 9.5H25.5V15.5" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.5 22.5L12.5 16.5" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
      <circle cx="22.5" cy="22.5" r="3" fill="#1E88E5" />
    </svg>
  );
};
