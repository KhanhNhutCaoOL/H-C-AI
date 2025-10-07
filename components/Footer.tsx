import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="w-full text-center mt-6 py-4">
            <p className="text-sm text-red-200">
                Thuộc sở hữu bởi 
                <a 
                    href="https://www.facebook.com/NhaniesShop.Mall" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-white hover:underline ml-1 font-semibold"
                >
                    Nhânie's Shop
                </a>
            </p>
        </footer>
    );
};

export default Footer;