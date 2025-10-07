import React from 'react';
import { LogoIcon } from './icons/LogoIcon';

const Header: React.FC = () => {
    return (
        <header className="text-center flex flex-col items-center">
            <LogoIcon className="mb-4" />
            <h1 className="text-[36px] font-extrabold text-white">
                AI TẠO ẢNH SIÊU CHẤT cùng NHÂNIE's SHOP +
            </h1>
            <p className="text-sm text-red-200 mt-1">
                Làm cho nhân vật của bạn trở nên sống động trong mọi khung cảnh.
            </p>
        </header>
    );
};

export default Header;