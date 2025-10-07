import React, { useRef } from 'react';
import { RestoreFormState, Quality, RestorationStyle } from '../types';
import { QUALITY_OPTIONS, RESTORATION_STYLE_OPTIONS } from '../constants';
import Card from './Card';
import { TickIcon } from './icons/TickIcon';
import { CameraIcon } from './icons/CameraIcon';
import { DiamondIcon } from './icons/DiamondIcon';
import { PaintBrushIcon } from './icons/PaintBrushIcon';

interface RestoreControlsPanelProps {
    formState: RestoreFormState;
    onStateChange: (updates: Partial<RestoreFormState>) => void;
    onGenerate: () => void;
    onStartOver: () => void;
    isLoading: boolean;
    elapsedTime: number;
    error: string | null;
    generationProgress: { current: number; total: number } | null;
}

const RestoreControlsPanel: React.FC<RestoreControlsPanelProps> = ({ formState, onStateChange, onGenerate, onStartOver, isLoading, elapsedTime, error, generationProgress }) => {
    
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            onStateChange({ image: e.target.files[0] });
        }
    };
    
    const handleRemoveImage = () => {
        onStateChange({ image: null });
        if (inputRef.current) {
            inputRef.current.value = "";
        }
    };

    const handleStyleChange = (optionId: RestorationStyle) => {
        const currentSelection = formState.style;
        const newSelection = currentSelection.includes(optionId)
            ? currentSelection.filter(id => id !== optionId)
            : [...currentSelection, optionId];
        onStateChange({ style: newSelection });
    };

    return (
        <Card className="flex flex-col gap-6 bg-red-50 animate-fade-in rounded-t-none">
             <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.3s ease-out;
                }
            `}</style>
            
            {/* Mục 1: Upload ảnh cũ */}
            <div>
                <h2 className="text-lg font-bold text-red-600 bg-green-200 rounded-lg p-2 flex items-center gap-2">
                    <CameraIcon className="w-6 h-6 text-black" />
                    <span>UPLOAD ẢNH CŨ</span>
                </h2>
                <div className="mt-4">
                     <input type="file" accept="image/*" ref={inputRef} className="hidden" onChange={handleFileChange} />
                     {!formState.image ? (
                        <div
                            className="w-full h-[140px] border-2 border-dashed border-border-color rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-primary-red transition-colors"
                            onClick={() => inputRef.current?.click()}
                        >
                            <p className="text-body-text">Nhấp để tải lên</p>
                            <p className="text-muted-text text-xs mt-1">Chọn 1 ảnh để phục hồi</p>
                        </div>
                     ) : (
                        <div className="relative group w-full p-2 border border-border-color rounded-xl flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                 <img
                                    src={URL.createObjectURL(formState.image)}
                                    alt="preview"
                                    className="w-16 h-16 object-cover rounded-md border border-border-color"
                                    onLoad={e => URL.revokeObjectURL((e.target as HTMLImageElement).src)}
                                />
                                <span className="text-sm text-muted-text truncate">{formState.image.name}</span>
                            </div>
                            <button
                                type="button"
                                onClick={handleRemoveImage}
                                aria-label="Xóa ảnh"
                                className="w-7 h-7 bg-error rounded-full text-white text-lg font-bold flex items-center justify-center flex-shrink-0"
                            >
                                &times;
                            </button>
                        </div>
                     )}
                </div>
            </div>

            <hr className="border-t border-border-color" />

            {/* Mục 2: Chất lượng ảnh */}
            <div>
                <h2 className="text-lg font-bold text-red-600 bg-green-200 rounded-lg p-2 flex items-center gap-2">
                    <DiamondIcon className="w-6 h-6" />
                    <span>CHẤT LƯỢNG HÌNH ẢNH</span>
                </h2>
                <div className="grid grid-cols-3 gap-3 mt-4">
                     {QUALITY_OPTIONS.map(option => (
                         <button
                            key={option.id}
                            type="button"
                            onClick={() => onStateChange({ quality: option.id })}
                            className={`relative group p-3 rounded-xl border transition-all duration-200 text-center ${
                                formState.quality === option.id 
                                ? 'border-primary-pink bg-primary-pink/10 shadow-glow-pink' 
                                : 'border-border-color bg-input-bg hover:bg-gradient-to-r hover:from-red-500 hover:to-orange-400 hover:border-transparent'
                            }`}
                         >
                            {formState.quality === option.id && (
                                <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-primary-pink text-white rounded-full flex items-center justify-center shadow">
                                    <TickIcon className="w-3 h-3" />
                                </div>
                            )}
                            <span className="font-semibold text-sm text-body-text group-hover:text-white">{option.label}</span>
                            <span className="block text-xs text-muted-text mt-1 group-hover:text-white/75">{option.caption}</span>
                         </button>
                     ))}
                </div>
            </div>

            <hr className="border-t border-border-color" />

            {/* Mục 3: Phong cách phục hồi */}
            <div>
                <h2 className="text-lg font-bold text-red-600 bg-green-200 rounded-lg p-2 flex items-center gap-2">
                    <PaintBrushIcon className="w-6 h-6 text-black" />
                    <span>PHONG CÁCH PHỤC HỒI</span>
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                    {RESTORATION_STYLE_OPTIONS.map(option => (
                        <button
                            key={option.id}
                            type="button"
                            onClick={() => handleStyleChange(option.id as RestorationStyle)}
                            className={`relative group p-3 rounded-xl border transition-all duration-200 text-center h-full ${
                                formState.style.includes(option.id as RestorationStyle)
                                ? 'border-primary-pink bg-primary-pink/10 shadow-glow-pink'
                                : 'border-border-color bg-input-bg hover:bg-gradient-to-r hover:from-red-500 hover:to-orange-400 hover:border-transparent'
                            }`}
                        >
                            {formState.style.includes(option.id as RestorationStyle) && (
                                <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-primary-pink text-white rounded-full flex items-center justify-center shadow">
                                    <TickIcon className="w-3 h-3" />
                                </div>
                            )}
                            <span className="font-semibold text-sm text-body-text group-hover:text-white">{option.label}</span>
                            <span className="block text-xs text-muted-text mt-1 group-hover:text-white/75">{option.caption}</span>
                        </button>
                    ))}
                </div>
            </div>

            {error && <p className="text-error text-sm text-center mt-4">{error}</p>}

            {/* Buttons */}
            <div className="flex items-center gap-4 mt-6">
                <button
                    onClick={onGenerate}
                    disabled={isLoading}
                    className="h-[52px] w-full bg-primary-red-active hover:bg-red-800 active:bg-red-900 rounded-xl text-white font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                    {isLoading ? (
                        <div className="flex items-center justify-center gap-3 px-4">
                           <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span className="font-semibold text-sm text-center">
                                {generationProgress
                                    ? `Đang phục hồi... (${elapsedTime}s)`
                                    : `Đang xử lý... (${elapsedTime}s)`
                                }
                            </span>
                        </div>
                    ) : 'PHỤC HỒI'}
                </button>
                <button
                    onClick={onStartOver}
                    className="flex-shrink-0 px-4 py-2 text-sm text-muted-text hover:text-body-text transition-colors"
                >
                    Làm Lại
                </button>
            </div>
        </Card>
    );
};

export default RestoreControlsPanel;