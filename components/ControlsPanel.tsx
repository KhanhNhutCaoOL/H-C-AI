import React, { useCallback, useRef } from 'react';
import { FormState, Quality, LogoPosition, CameraAngle } from '../types';
import { QUALITY_OPTIONS, ASPECT_RATIO_OPTIONS, NUMBER_OF_IMAGES_OPTIONS, SCENE_OPTIONS, CHARACTER_DESC_OPTIONS, ACTION_DESC_OPTIONS, STYLE_DESC_OPTIONS, CAMERA_ANGLE_OPTIONS, SIGNATURE_FONT_OPTIONS, LOGO_POSITION_OPTIONS } from '../constants';
import Card from './Card';
import { CameraIcon } from './icons/CameraIcon';
import { GenderIcon } from './icons/GenderIcon';
import { SceneIcon } from './icons/SceneIcon';
import { AspectRatioIcon } from './icons/AspectRatioIcon';
import { FilmIcon } from './icons/FilmIcon';
import { DiamondIcon } from './icons/DiamondIcon';
import { TickIcon } from './icons/TickIcon';
import { CameraAngleIcon } from './icons/CameraAngleIcon';
import { StarIcon } from './icons/StarIcon';

// Sub-components defined in the same file to keep file count low, but could be separated.

// --- ToggleSwitch ---
interface ToggleSwitchProps {
    label: string;
    helperText: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
}
const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ label, helperText, checked, onChange }) => (
    <div>
        <div className="flex items-center justify-between">
            <label className="text-body-text font-medium">{label}</label>
            <button
                type="button"
                role="switch"
                aria-checked={checked}
                onClick={() => onChange(!checked)}
                className={`${
                    checked ? 'bg-primary-red' : 'bg-toggle-off'
                } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-red focus:ring-offset-2 focus:ring-offset-panel-bg`}
            >
                <span
                    aria-hidden="true"
                    className={`${
                        checked ? 'translate-x-5' : 'translate-x-0'
                    } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-thumb shadow ring-0 transition duration-200 ease-in-out`}
                />
            </button>
        </div>
        <p className="text-muted-text text-xs mt-1">{helperText}</p>
    </div>
);

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

// --- LogoUploader ---
interface LogoUploaderProps {
    logo: File | null;
    onLogoChange: (file: File | null) => void;
}
const LogoUploader: React.FC<LogoUploaderProps> = ({ logo, onLogoChange }) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            onLogoChange(e.target.files[0]);
        }
    };

    const handleRemoveLogo = () => {
        onLogoChange(null);
        if(inputRef.current) {
            inputRef.current.value = "";
        }
    };

    return (
        <div className="flex items-center gap-4">
            <input type="file" accept="image/*" ref={inputRef} className="hidden" onChange={handleFileChange} />
            {!logo ? (
                <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    className="w-full h-[60px] border-2 border-dashed border-border-color rounded-xl flex items-center justify-center cursor-pointer hover:border-primary-red transition-colors"
                >
                    <span className="text-muted-text text-sm">Nhấp để tải lên logo</span>
                </button>
            ) : (
                <div className="relative group w-full p-2 border border-border-color rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                         <img
                            src={URL.createObjectURL(logo)}
                            alt="logo preview"
                            className="w-12 h-12 object-contain rounded-md"
                            onLoad={e => URL.revokeObjectURL((e.target as HTMLImageElement).src)}
                        />
                        <span className="text-sm text-muted-text truncate">{logo.name}</span>
                    </div>
                    <button
                        type="button"
                        onClick={handleRemoveLogo}
                        aria-label="Xóa logo"
                        className="w-7 h-7 bg-error rounded-full text-white text-lg font-bold flex items-center justify-center flex-shrink-0"
                    >
                        &times;
                    </button>
                </div>
            )}
        </div>
    );
};


// --- Main ControlsPanel ---
interface ControlsPanelProps {
    formState: FormState;
    onStateChange: (updates: Partial<FormState>) => void;
    onGenerate: () => void;
    onStartOver: () => void;
    isLoading: boolean;
    elapsedTime: number;
    error: string | null;
    generationProgress: { current: number; total: number } | null;
}

const ControlsPanel: React.FC<ControlsPanelProps> = ({ formState, onStateChange, onGenerate, onStartOver, isLoading, elapsedTime, error, generationProgress }) => {
    
    const outfitInputRef = useRef<HTMLInputElement>(null);
    const productInputRef = useRef<HTMLInputElement>(null);
    const celebrityInputRef = useRef<HTMLInputElement>(null);

    const handleFilesChange = (files: File[]) => {
        // Append new files to existing ones
        onStateChange({ images: [...formState.images, ...files] });
    };

    const handleRemoveImage = (indexToRemove: number) => {
        const updatedImages = formState.images.filter((_, index) => index !== indexToRemove);
        onStateChange({ images: updatedImages });
    };

    const handleCharacterDescChange = (optionId: string) => {
        const currentSelection = formState.characterDesc;
        const newSelection = currentSelection.includes(optionId)
            ? currentSelection.filter(id => id !== optionId)
            : [...currentSelection, optionId];
        onStateChange({ characterDesc: newSelection });
    };

    const handleSceneDescChange = (optionId: string) => {
        const currentSelection = formState.sceneDesc;
        const newSelection = currentSelection.includes(optionId)
            ? currentSelection.filter(id => id !== optionId)
            : [...currentSelection, optionId];
        onStateChange({ sceneDesc: newSelection });
    };

    const handleActionDescChange = (optionId: string) => {
        const currentSelection = formState.actionDesc;
        const newSelection = currentSelection.includes(optionId)
            ? currentSelection.filter(id => id !== optionId)
            : [...currentSelection, optionId];
        onStateChange({ actionDesc: newSelection });
    };

    const handleStyleDescChange = (optionId: string) => {
        const currentSelection = formState.styleDesc;
        const isSelected = currentSelection.includes(optionId);
        let newSelection;

        if (isSelected) {
            newSelection = currentSelection.filter(id => id !== optionId);
        } else {
            if (currentSelection.length < 2) {
                newSelection = [...currentSelection, optionId];
            } else {
                return;
            }
        }
        onStateChange({ styleDesc: newSelection });
    };

    const handleOutfitImagesChange = (files: File[]) => {
        onStateChange({ outfitImages: [...formState.outfitImages, ...files] });
    };

    const handleRemoveOutfitImage = (indexToRemove: number) => {
        const updatedImages = formState.outfitImages.filter((_, index) => index !== indexToRemove);
        onStateChange({ outfitImages: updatedImages });
    };
    
    const handleRemoveProductImage = () => {
        onStateChange({ productImage: null });
        if (productInputRef.current) {
            productInputRef.current.value = "";
        }
    };

    const handleRemoveCelebrityImage = () => {
        onStateChange({ celebrityImage: null });
        if (celebrityInputRef.current) {
            celebrityInputRef.current.value = "";
        }
    };


    return (
        <Card className="flex flex-col gap-6 bg-red-50 rounded-t-none animate-fade-in">
            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.3s ease-out;
                }
            `}</style>
            <div>
                <h2 className="text-lg font-bold text-red-600 bg-green-200 rounded-lg p-2 flex items-center gap-2">
                    <CameraIcon className="w-6 h-6 text-black" />
                    <span>ẢNH MẪU THAM CHIẾU</span>
                </h2>
                <div className="mt-4 flex flex-col gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Cột 1: Ảnh mẫu tham chiếu */}
                        <div className="flex flex-col gap-4">
                            <h3 className="text-sm font-medium text-muted-text">ẢNH NHÂN VẬT THAM CHIẾU</h3>
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
                        {/* Cột 2: Ảnh sản phẩm */}
                        <div className="flex flex-col">
                            <h3 className="text-sm font-medium text-blue-800 opacity-80 mb-2">Kết hợp ảnh với sản phẩm</h3>
                            <div className="flex-grow">
                                <input
                                    type="file"
                                    accept="image/*"
                                    ref={productInputRef}
                                    className="hidden"
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                            onStateChange({ productImage: e.target.files[0] });
                                        }
                                    }}
                                />
                                {!formState.productImage ? (
                                    <div
                                        onClick={() => productInputRef.current?.click()}
                                        className="w-full h-full min-h-[140px] border-2 border-dashed border-border-color rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-primary-red transition-colors"
                                    >
                                        <p className="text-body-text">Nhấp để tải lên</p>
                                        <p className="text-muted-text text-xs mt-1">Chọn 1 ảnh sản phẩm</p>
                                    </div>
                                ) : (
                                    <div className="relative group w-full p-2 border border-border-color rounded-xl flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={URL.createObjectURL(formState.productImage)}
                                                alt="product preview"
                                                className="w-16 h-16 object-contain rounded-md"
                                                onLoad={e => URL.revokeObjectURL((e.target as HTMLImageElement).src)}
                                            />
                                            <span className="text-sm text-muted-text truncate">{formState.productImage.name}</span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleRemoveProductImage}
                                            aria-label="Xóa ảnh sản phẩm"
                                            className="w-7 h-7 bg-error rounded-full text-white text-lg font-bold flex items-center justify-center flex-shrink-0"
                                        >
                                            &times;
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    <ToggleSwitch
                        label="Xóa Nền"
                        helperText="Xóa nền khỏi ảnh tham chiếu trước khi tạo."
                        checked={formState.removeBackground}
                        onChange={removeBackground => onStateChange({ removeBackground })}
                    />
                    <ToggleSwitch
                        label="Khoá gương mặt người mẫu & hình ảnh, chữ trên sản phẩm 100%"
                        helperText="Khi được bật, AI sẽ giữ nguyên 100% khuôn mặt của người mẫu, cũng như bất kỳ hình ảnh và văn bản nào có trên sản phẩm trong ảnh tham chiếu."
                        checked={formState.lockFace}
                        onChange={lockFace => onStateChange({ lockFace })}
                    />
                </div>
            </div>

            <hr className="border-t border-border-color" />

            <div>
                <h2 className="text-lg font-bold text-blue-700 bg-orange-200 rounded-lg p-2 flex items-center gap-2">
                    <GenderIcon className="w-6 h-6" />
                    <span>GIỚI TÍNH - NHÂN VẬT</span>
                </h2>
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                    {CHARACTER_DESC_OPTIONS.map(option => (
                        <button
                            key={option.id}
                            type="button"
                            onClick={() => handleCharacterDescChange(option.id)}
                            className={`relative group p-3 rounded-xl border transition-all duration-200 text-center h-full ${
                                formState.characterDesc.includes(option.id)
                                ? 'border-primary-pink bg-primary-pink/10 shadow-glow-pink' 
                                : 'border-border-color bg-input-bg hover:bg-gradient-to-r hover:from-red-500 hover:to-orange-400 hover:border-transparent'
                            }`}
                        >
                            {formState.characterDesc.includes(option.id) && (
                                <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-primary-pink text-white rounded-full flex items-center justify-center shadow">
                                    <TickIcon className="w-3 h-3" />
                                </div>
                            )}
                            <span className="font-semibold text-body-text group-hover:text-white">{option.label}</span>
                        </button>
                    ))}
                 </div>
                <div className="mt-4">
                    <label htmlFor="character-notes" className="text-sm font-medium text-body-text">Ghi chú thêm (tùy chọn):</label>
                    <textarea
                        id="character-notes"
                        rows={2}
                        className="mt-1 p-2 block w-full rounded-lg border border-border-color bg-input-bg shadow-subtle-inner focus:border-primary-red focus:ring-primary-red transition"
                        placeholder="Ví dụ: Chú thỏ trắng"
                        value={formState.characterNotes}
                        onChange={(e) => onStateChange({ characterNotes: e.target.value })}
                    />
                </div>
            </div>

            <hr className="border-t border-border-color" />

            <div>
                <h2 className="text-lg font-bold text-blue-700 bg-orange-200 rounded-lg p-2 flex items-center gap-2">
                    <SceneIcon className="w-6 h-6" />
                    <span>BỐI CẢNH</span>
                </h2>
                <p className="text-muted-text text-sm mt-1">Có thể chọn nhiều bối cảnh.</p>
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                    {SCENE_OPTIONS.map(option => (
                        <button
                            key={option.id}
                            type="button"
                            onClick={() => handleSceneDescChange(option.id)}
                            className={`relative group p-3 rounded-xl border transition-all duration-200 text-center text-sm ${
                                formState.sceneDesc.includes(option.id)
                                ? 'border-primary-pink bg-primary-pink/10 shadow-glow-pink' 
                                : 'border-border-color bg-input-bg hover:bg-gradient-to-r hover:from-red-500 hover:to-orange-400 hover:border-transparent'
                            }`}
                        >
                            {formState.sceneDesc.includes(option.id) && (
                                <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-primary-pink text-white rounded-full flex items-center justify-center shadow">
                                    <TickIcon className="w-3 h-3" />
                                </div>
                            )}
                            <span className="font-semibold text-body-text group-hover:text-white">{option.label}</span>
                        </button>
                    ))}
                 </div>
                <div className="mt-4">
                    <label htmlFor="scene-notes" className="text-sm font-medium text-body-text">Ghi chú thêm (tùy chọn):</label>
                    <textarea
                        id="scene-notes"
                        rows={2}
                        className="mt-1 p-2 block w-full rounded-lg border border-border-color bg-input-bg shadow-subtle-inner focus:border-primary-red focus:ring-primary-red transition"
                        placeholder="Ví dụ: Ở trên thiên đình"
                        value={formState.sceneNotes}
                        onChange={(e) => onStateChange({ sceneNotes: e.target.value })}
                    />
                </div>
            </div>

            <hr className="border-t border-border-color" />

            <div>
                <h2 className="text-lg font-bold text-blue-700 bg-orange-200 rounded-lg p-2 flex items-center gap-2">
                    <span className="text-xl">🎲</span>
                    <span>HÀNH ĐỘNG</span>
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                    {ACTION_DESC_OPTIONS.map(option => (
                        <button
                            key={option.id}
                            type="button"
                            onClick={() => handleActionDescChange(option.id)}
                            className={`relative group p-3 rounded-xl border transition-all duration-200 text-center h-full text-sm ${
                                formState.actionDesc.includes(option.id)
                                ? 'border-primary-pink bg-primary-pink/10 shadow-glow-pink' 
                                : 'border-border-color bg-input-bg hover:bg-gradient-to-r hover:from-red-500 hover:to-orange-400 hover:border-transparent'
                            }`}
                        >
                            {formState.actionDesc.includes(option.id) && (
                                <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-primary-pink text-white rounded-full flex items-center justify-center shadow">
                                    <TickIcon className="w-3 h-3" />
                                </div>
                            )}
                            <span className="font-semibold text-body-text group-hover:text-white">{option.label}</span>
                        </button>
                    ))}
                </div>
                <div className="mt-4">
                    <label htmlFor="action-notes" className="text-sm font-medium text-body-text">Ghi chú thêm (tùy chọn):</label>
                    <textarea
                        id="action-notes"
                        rows={2}
                        className="mt-1 p-2 block w-full rounded-lg border border-border-color bg-input-bg shadow-subtle-inner focus:border-primary-red focus:ring-primary-red transition"
                        placeholder="Ví dụ: Người đàn ông đang ngồi cạnh cô gái"
                        value={formState.actionNotes}
                        onChange={(e) => onStateChange({ actionNotes: e.target.value })}
                    />
                </div>
            </div>

            <hr className="border-t border-border-color" />

            <div>
                <h2 className="text-lg font-bold text-blue-700 bg-orange-200 rounded-lg p-2 flex items-center gap-2">
                    <CameraAngleIcon className="w-6 h-6 text-black" />
                    <span>GÓC QUAY CHỤP ẢNH</span>
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                    {CAMERA_ANGLE_OPTIONS.map(option => (
                        <button
                            key={option.id}
                            type="button"
                            onClick={() => onStateChange({ cameraAngle: option.id })}
                            className={`relative group p-3 rounded-xl border transition-all duration-200 text-center h-full text-sm ${
                                formState.cameraAngle === option.id
                                ? 'border-primary-pink bg-primary-pink/10 shadow-glow-pink' 
                                : 'border-border-color bg-input-bg hover:bg-gradient-to-r hover:from-red-500 hover:to-orange-400 hover:border-transparent'
                            }`}
                        >
                            {formState.cameraAngle === option.id && (
                                <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-primary-pink text-white rounded-full flex items-center justify-center shadow">
                                    <TickIcon className="w-3 h-3" />
                                </div>
                            )}
                            <span className="font-semibold text-body-text group-hover:text-white">{option.label}</span>
                        </button>
                    ))}
                </div>
            </div>
            
            <hr className="border-t border-border-color" />

            <div>
                <h2 className="text-lg font-bold text-blue-700 bg-orange-200 rounded-lg p-2 flex items-center gap-2">
                    <span className="text-xl">📸</span>
                    <span>PHONG CÁCH HÌNH ẢNH</span>
                </h2>
                <p className="text-muted-text text-sm mt-1">Chọn tối đa 2 phong cách.</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                    {STYLE_DESC_OPTIONS.map(option => (
                        <button
                            key={option.id}
                            type="button"
                            onClick={() => handleStyleDescChange(option.id)}
                            className={`relative group p-3 rounded-xl border transition-all duration-200 text-center h-full text-sm ${
                                formState.styleDesc.includes(option.id)
                                ? 'border-primary-pink bg-primary-pink/10 shadow-glow-pink' 
                                : 'border-border-color bg-input-bg hover:bg-gradient-to-r hover:from-red-500 hover:to-orange-400 hover:border-transparent'
                            }`}
                        >
                             {formState.styleDesc.includes(option.id) && (
                                <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-primary-pink text-white rounded-full flex items-center justify-center shadow">
                                    <TickIcon className="w-3 h-3" />
                                </div>
                            )}
                            <span className="font-semibold text-body-text group-hover:text-white">{option.label}</span>
                        </button>
                    ))}
                </div>
            </div>
            
            <hr className="border-t border-border-color" />
            
            <div>
                <h2 className="text-lg font-bold text-blue-700 bg-orange-200 rounded-lg p-2 flex items-center gap-2">
                    <span className="text-xl">👘</span>
                    <span>THAY ĐỔI TRANG PHỤC</span>
                </h2>
                <div className="mt-4">
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        ref={outfitInputRef}
                        className="hidden"
                        onChange={(e) => {
                            if (e.target.files) {
                                handleOutfitImagesChange(Array.from(e.target.files));
                            }
                        }}
                    />
                    <button
                        type="button"
                        onClick={() => outfitInputRef.current?.click()}
                        className="w-full h-[60px] border-2 border-dashed border-border-color rounded-xl flex items-center justify-center cursor-pointer hover:border-primary-red transition-colors"
                    >
                        <span className="text-muted-text text-sm">Nhấp để tải lên ảnh trang phục (có thể chọn nhiều ảnh)</span>
                    </button>

                    {formState.outfitImages.length > 0 && (
                        <div className="flex flex-wrap gap-3 mt-4">
                            {formState.outfitImages.map((file, index) => (
                                <div key={index} className="relative group">
                                    <img
                                        src={URL.createObjectURL(file)}
                                        alt={`outfit preview ${index}`}
                                        className="w-16 h-16 object-cover rounded-md border border-border-color transition-all duration-200 group-hover:scale-105 group-hover:shadow-glow-red"
                                        onLoad={e => URL.revokeObjectURL((e.target as HTMLImageElement).src)}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveOutfitImage(index)}
                                        aria-label={`Xóa trang phục ${index + 1}`}
                                        className="absolute top-0 right-0 -mt-2 -mr-2 w-5 h-5 bg-error rounded-full text-white text-xs font-bold flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100"
                                    >
                                        &times;
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="mt-4">
                        <label htmlFor="outfit-notes" className="text-sm font-medium text-body-text">Điền tên trang phục:</label>
                        <textarea
                            id="outfit-notes"
                            rows={2}
                            className="mt-1 p-2 block w-full rounded-lg border border-border-color bg-input-bg shadow-subtle-inner focus:border-primary-red focus:ring-primary-red transition"
                            placeholder="Ví dụ: Trang phục cổ trang Trung Quốc"
                            value={formState.outfitNotes}
                            onChange={(e) => onStateChange({ outfitNotes: e.target.value })}
                        />
                    </div>
                </div>
            </div>

            <hr className="border-t border-border-color" />

             <div>
                <h2 className="text-lg font-bold text-blue-700 bg-orange-200 rounded-lg p-2 flex items-center gap-2">
                    <StarIcon className="w-6 h-6" />
                    <span>ĐỨNG CẠNH NHÂN VẬT NỔI TIẾNG</span>
                </h2>
                <div className="mt-4">
                    <input
                        type="file"
                        accept="image/*"
                        ref={celebrityInputRef}
                        className="hidden"
                        onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                                onStateChange({ celebrityImage: e.target.files[0] });
                            }
                        }}
                    />
                    {!formState.celebrityImage ? (
                        <button
                            type="button"
                            onClick={() => celebrityInputRef.current?.click()}
                            className="w-full h-[60px] border-2 border-dashed border-border-color rounded-xl flex items-center justify-center cursor-pointer hover:border-primary-red transition-colors"
                        >
                            <span className="text-muted-text text-sm">Nhấp để tải lên ảnh người nổi tiếng</span>
                        </button>
                    ) : (
                        <div className="relative group w-full p-2 border border-border-color rounded-xl flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                 <img
                                    src={URL.createObjectURL(formState.celebrityImage)}
                                    alt="celebrity preview"
                                    className="w-12 h-12 object-cover rounded-md"
                                    onLoad={e => URL.revokeObjectURL((e.target as HTMLImageElement).src)}
                                />
                                <span className="text-sm text-muted-text truncate">{formState.celebrityImage.name}</span>
                            </div>
                            <button
                                type="button"
                                onClick={handleRemoveCelebrityImage}
                                aria-label="Xóa ảnh người nổi tiếng"
                                className="w-7 h-7 bg-error rounded-full text-white text-lg font-bold flex items-center justify-center flex-shrink-0"
                            >
                                &times;
                            </button>
                        </div>
                    )}
                </div>
            </div>
            
            <hr className="border-t border-border-color" />
            
            <div>
                 <h2 className="text-lg font-bold text-blue-700 bg-orange-200 rounded-lg p-2 flex items-center gap-2">
                    <span className="text-xl">🏖</span>
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

            <div>
                <h2 className="text-lg font-bold text-blue-700 bg-orange-200 rounded-lg p-2 flex items-center gap-2">
                    <AspectRatioIcon className="w-6 h-6 text-black" />
                    <span>TỈ LỆ KHUNG HÌNH</span>
                </h2>
                <div className="grid grid-cols-5 gap-3 mt-4">
                    {ASPECT_RATIO_OPTIONS.map(option => (
                        <button
                           key={option.id}
                           type="button"
                           onClick={() => onStateChange({ aspectRatio: option.id })}
                           className={`relative group p-3 rounded-xl border transition-all duration-200 text-center ${
                               formState.aspectRatio === option.id 
                               ? 'border-primary-pink bg-primary-pink/10 shadow-glow-pink' 
                               : 'border-border-color bg-input-bg hover:bg-gradient-to-r hover:from-red-500 hover:to-orange-400 hover:border-transparent'
                           }`}
                        >
                           {formState.aspectRatio === option.id && (
                                <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-primary-pink text-white rounded-full flex items-center justify-center shadow">
                                    <TickIcon className="w-3 h-3" />
                                </div>
                            )}
                           <span className="font-semibold text-sm text-body-text group-hover:text-white">{option.id}</span>
                           <span className="block text-xs text-muted-text mt-1 group-hover:text-white/75">{option.label}</span>
                        </button>
                    ))}
                </div>
           </div>

            <hr className="border-t border-border-color" />
            
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

            <hr className="border-t border-border-color" />

            <div>
                <h2 className="text-lg font-bold text-blue-700 bg-orange-200 rounded-lg p-2 flex items-center gap-2">
                    <DiamondIcon className="w-6 h-6" />
                    <span>THÊM LOGO</span>
                </h2>
                <div className="mt-4 flex flex-col gap-4">
                    <LogoUploader 
                        logo={formState.logoImage}
                        onLogoChange={(file) => onStateChange({ logoImage: file })}
                    />
                    {formState.logoImage && (
                         <div>
                            <label className="text-sm font-medium text-body-text mb-2 block">Vị trí logo</label>
                            <div className="grid grid-cols-4 gap-3">
                                {LOGO_POSITION_OPTIONS.map(option => (
                                    <button
                                       key={option.id}
                                       type="button"
                                       title={option.label}
                                       onClick={() => onStateChange({ logoPosition: option.id })}
                                       className={`relative group p-3 rounded-xl border transition-all duration-200 text-center ${
                                           formState.logoPosition === option.id
                                           ? 'border-primary-pink bg-primary-pink/10 shadow-glow-pink' 
                                           : 'border-border-color bg-input-bg hover:border-muted-text'
                                       }`}
                                    >
                                       <option.icon className={`w-6 h-6 mx-auto ${formState.logoPosition === option.id ? 'text-primary-pink' : 'text-muted-text'}`} />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                    <ToggleSwitch
                        label="Bật chữ ký tự động"
                        helperText="Tự động thêm chữ ký 'Nhânie's SHOP' vào ảnh một cách nghệ thuật."
                        checked={formState.useSignature}
                        onChange={useSignature => onStateChange({ useSignature })}
                    />
                    {formState.useSignature && (
                         <div className="mt-4 animate-fade-in-subtle space-y-4">
                             <style>{`
                                @keyframes fade-in-subtle {
                                    from { opacity: 0; transform: translateY(5px); }
                                    to { opacity: 1; transform: translateY(0); }
                                }
                                .animate-fade-in-subtle { animation: fade-in-subtle 0.3s ease-out; }
                            `}</style>
                            <div>
                                <label className="text-sm font-medium text-body-text mb-2 block">Chọn phông chữ</label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {SIGNATURE_FONT_OPTIONS.map(option => (
                                        <button
                                           key={option.id}
                                           type="button"
                                           title={option.label}
                                           onClick={() => onStateChange({ signatureFont: option.id })}
                                           className={`relative group p-3 rounded-xl border transition-all duration-200 text-center ${
                                               formState.signatureFont === option.id
                                               ? 'border-primary-pink bg-primary-pink/10 shadow-glow-pink' 
                                               : 'border-border-color bg-input-bg hover:border-muted-text'
                                           }`}
                                        >
                                           <span className={`${option.className} text-sm truncate ${formState.signatureFont === option.id ? 'text-primary-pink' : 'text-body-text'}`}>{option.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-body-text mb-2 block">Vị trí chữ ký</label>
                                <div className="grid grid-cols-4 gap-3">
                                    {LOGO_POSITION_OPTIONS.map(option => (
                                        <button
                                           key={option.id}
                                           type="button"
                                           title={option.label}
                                           onClick={() => onStateChange({ signaturePosition: option.id })}
                                           className={`relative group p-3 rounded-xl border transition-all duration-200 text-center ${
                                               formState.signaturePosition === option.id
                                               ? 'border-primary-pink bg-primary-pink/10 shadow-glow-pink' 
                                               : 'border-border-color bg-input-bg hover:border-muted-text'
                                           }`}
                                        >
                                           <option.icon className={`w-6 h-6 mx-auto ${formState.signaturePosition === option.id ? 'text-primary-pink' : 'text-muted-text'}`} />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {error && <p className="text-error text-sm text-center mt-4">{error}</p>}

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

export default ControlsPanel;