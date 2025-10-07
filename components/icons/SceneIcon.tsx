import React from 'react';

export const SceneIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        fill="none"
    >
        {/* Frame */}
        <rect x="3" y="3" width="18" height="18" rx="2" stroke="#4B5563" strokeWidth="1.5"/>
        {/* Sun */}
        <circle cx="8" cy="8" r="2" fill="#FBBF24"/>
        {/* Mountains */}
        <path d="M4 17.5L9 11L13 15L16 12L20 17" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);