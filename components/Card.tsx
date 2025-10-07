import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    padding?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '', padding = 'p-6' }) => {
    return (
        <div className={`rounded-xl border border-border-color shadow-md ${padding} ${className}`}>
            {children}
        </div>
    );
};

export default Card;