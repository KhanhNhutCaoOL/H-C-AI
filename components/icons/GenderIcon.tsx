import React from 'react';

export const GenderIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        fill="none"
    >
        {/* Male Figure */}
        <circle cx="8" cy="6" r="3" fill="#3B82F6"/>
        <path stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" d="M8 9V17"/>
        <path stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" d="M5 21L8 17L11 21"/>
        
        {/* Female Figure */}
        <circle cx="16" cy="6" r="3" fill="#EC4899"/>
        <path d="M14 9H18L19 17H13L14 9Z" fill="#EC4899"/>
        <path stroke="#EC4899" strokeWidth="2" strokeLinecap="round" d="M14.5 21L16 17"/>
        <path stroke="#EC4899" strokeWidth="2" strokeLinecap="round" d="M17.5 21L16 17"/>
    </svg>
);