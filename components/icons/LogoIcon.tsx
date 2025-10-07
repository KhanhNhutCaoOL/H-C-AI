import React from 'react';

export const LogoIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
    <svg 
        width="56" 
        height="56" 
        viewBox="0 0 56 56" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className={className}
    >
        <defs>
            <linearGradient id="paint0_linear_cat_gold" x1="0" y1="0" x2="56" y2="56" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FBBF24" />
                <stop offset="1" stopColor="#F59E0B" />
            </linearGradient>
        </defs>
        <rect width="56" height="56" rx="12" fill="url(#paint0_linear_cat_gold)" />
        <path
            d="M28 21.5C20.5 21.5 16.5 27 16.5 32C16.5 37 20 40.5 28 40.5C36 40.5 39.5 37 39.5 32C39.5 27 35.5 21.5 28 21.5Z"
            fill="#0F1B24"
        />
        <path
            d="M17.5 25C16.5 20 20.5 16 23.5 16C26.5 16 26.5 19 25.5 23"
            stroke="#0F1B24"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M38.5 25C39.5 20 35.5 16 32.5 16C29.5 16 29.5 19 30.5 23"
            stroke="#0F1B24"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <circle cx="24" cy="31" r="2" fill="#FDE047" />
        <circle cx="32" cy="31" r="2" fill="#FDE047" />
        <path
            d="M26 36H30"
            stroke="#FDE047"
            strokeWidth="2"
            strokeLinecap="round"
        />
    </svg>
);
