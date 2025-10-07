import React, { useRef } from 'react';
import { PromptFormState } from '../types';
import { NUMBER_OF_IMAGES_OPTIONS } from '../constants';
import Card from './Card';
import { FilmIcon } from './icons/FilmIcon';
import { TickIcon } from './icons/TickIcon';
import { CameraIcon } from './icons/CameraIcon';

// Re-implementing a simplified Dropzone and ImagePreview for this component
// --- Dropzone ---
interface DropzoneProps {
    onFilesChange: (files: File[]) => void;
}
const Dropzone: React.FC<DropzoneProps> = ({ onFilesChange }) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            onFilesChange(Array.from(e.target.files));
        }
    };
    return (
        <div
            className="w-full h-[140px] border-2 border-dashed border-border-color rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-primary-red transition-colors"
            onClick={() => inputRef.current?.click()}
        >
            <input type="file" multiple accept="image/*" ref={inputRef} className="hidden" onChange={handleFileChange} />
            <p className="text-body-text">Nhấp để tải lên</p>
            <p className="text-muted-text text-xs mt-1">Bạn có thể chọn nhiều ảnh</p>
        </div>
    );
};

interface PromptControlsPanelProps {
    formState: PromptFormState;
    onStateChange: (updates: Partial<PromptFormState>) => void;
    onGenerate: () => void;
    onStartOver: () => void;
    isLoading: boolean;
    elapsedTime: number;
    error: string | null;
    generationProgress: { current: number; total: number } | null;
}

const PromptControlsPanel: React.FC<PromptControlsPanelProps> = ({ formState, onStateChange, onGenerate, onStartOver, isLoading, elapsedTime, error, generationProgress }) => {
    
    const handleFilesChange = (files: File[]) => {
        onStateChange({ images: [...formState.images, ...files] });
    };

    const handleRemoveImage = (indexToRemove: number) => {
        const updatedImages = formState.images.filter((_, index) => index !== indexToRemove);
        onStateChange({ images: updatedImages });
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
            {/* Mục 1: Upload ảnh lên */}
            <div>
                <h2 className="text-lg font-bold text-red-600 bg-green-200 rounded-lg p-2 flex items-center gap-2">
                    <CameraIcon className="w-6 h-6 text-black" />
                    <span>TẢI ẢNH THAM CHIẾU</span>
                </h2>
                <div className="mt-4 flex flex-col gap-4">
                    <Dropzone onFilesChange={handleFilesChange} />
                     {formState.images.length > 0 && (
                        <div className="flex flex-wrap gap-3">
                            {formState.images.map((file, index) => (
                                <div key={index} className="relative group">
                                    <img
                                        src={URL.createObjectURL(file)}
                                        alt={`preview ${index}`}
                                        className="w-16 h-16 object-cover rounded-md border border-border-color transition-all duration-200 group-hover:scale-105 group-hover:shadow-glow-red"
                                        onLoad={e => URL.revokeObjectURL((e.target as HTMLImageElement).src)}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveImage(index)}
                                        aria-label={`Xóa ảnh ${index + 1}`}
                                        className="absolute top-0 right-0 -mt-2 -mr-2 w-5 h-5 bg-error rounded-full text-white text-xs font-bold flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100"
                                    >
                                        &times;
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <hr className="border-t border-border-color" />

            {/* Mục 2: Ô ghi prompt */}
            <div>
                 <h2 className="text-lg font-bold text-blue-700 bg-orange-200 rounded-lg p-2 flex items-center gap-2">
                    <span className="text-xl">✏️</span>
                    <span>NHẬP PROMPT</span>
                </h2>
                <div className="mt-4">
                    <textarea
                        rows={4}
                        className="p-3 block w-full rounded-lg border border-border-color bg-input-bg shadow-subtle-inner focus:border-primary-red focus:ring-primary-red transition"
                        placeholder="Ví dụ: Thêm một chiếc mũ cao bồi cho nhân vật"
                        value={formState.prompt}
                        onChange={(e) => onStateChange({ prompt: e.target.value })}
                    />
                </div>
            </div>
            
            <hr className="border-t border-border-color" />
            
            {/* Mục 3: Số lượng ảnh */}
            <div>
                <h2 className="text-lg font-bold text-blue-700 bg-orange-200 rounded-lg p-2 flex items-center gap-2">
                    <FilmIcon className="w-6 h-6" />
                    <span>SỐ LƯỢNG ẢNH</span>
                </h2>
                <div className="grid grid-cols-4 md:grid-cols-8 gap-3 mt-4">
                    {NUMBER_OF_IMAGES_OPTIONS.map(option => (
                        <button
                           key={option}
                           type="button"
                           onClick={() => onStateChange({ numberOfImages: option })}
                           className={`relative group py-3 rounded-xl border transition-all duration-200 text-center ${
                               formState.numberOfImages === option 
                               ? 'border-primary-pink bg-primary-pink/10 shadow-glow-pink' 
                               : 'border-border-color bg-input-bg hover:bg-gradient-to-r hover:from-red-500 hover:to-orange-400 hover:border-transparent'
                           }`}
                        >
                            {formState.numberOfImages === option && (
                                <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-primary-pink text-white rounded-full flex items-center justify-center shadow">
                                    <TickIcon className="w-3 h-3" />
                                </div>
                            )}
                           <span className="font-semibold text-xl text-body-text group-hover:text-white">{option}</span>
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
                    className="h-[52px] w-full bg-primary-red hover:bg-primary-red-hover active:bg-primary-red-active rounded-xl text-white font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                    {isLoading ? (
                        <div className="flex items-center justify-center gap-3 px-4">
                           <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span className="font-semibold text-sm text-center">
                                {generationProgress
                                    ? `Đang tạo ${generationProgress.current}/${generationProgress.total}... (${elapsedTime}s)`
                                    : `Đang xử lý... (${elapsedTime}s)`
                                }
                            </span>
                        </div>
                    ) : 'Tạo Ảnh'}
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

export default PromptControlsPanel;