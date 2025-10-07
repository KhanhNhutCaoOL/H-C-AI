import React from 'react';

export const PositionTopLeftIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg 
        viewBox="0 0 24 24" 
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        fill="none"
    >
        <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <rect x="5" y="5" width="4" height="4" rx="1" fill="currentColor" />
    </svg>
);
