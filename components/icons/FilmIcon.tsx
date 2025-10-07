import React from 'react';

export const FilmIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
    >
        <path fill="#DC2626" d="M20,2H4A2,2 0 0,0 2,4V20A2,2 0 0,0 4,22H20A2,2 0 0,0 22,20V4A2,2 0 0,0 20,2M20,17H4V7H20V17Z" />
        <path fill="#1F2937" d="M4,5H7V3H4V5M17,5H20V3H17V5M4,21H7V19H4V21M17,21H20V19H17V21Z" />
    </svg>
);
