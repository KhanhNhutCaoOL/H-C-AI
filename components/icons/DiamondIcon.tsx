import React from 'react';

export const DiamondIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
    >
        <path
            fill="#14B8A6"
            d="M12,2L2,8.5L12,22L22,8.5L12,2Z"
        />
    </svg>
);
