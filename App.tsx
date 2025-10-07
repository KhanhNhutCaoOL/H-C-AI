import React, { useState, useCallback, useEffect, useRef } from 'react';
import { FormState, GeneratedMedia, PromptFormState, LogoPosition, VideoFormState } from './types';
import { INITIAL_FORM_STATE, INITIAL_PROMPT_FORM_STATE, INITIAL_VIDEO_FORM_STATE, ASPECT_RATIO_OPTIONS } from './constants';
import { generateCharacterImages, generateImagesFromPrompt, generateVideoFromPrompt } from './services/geminiService';
import Header from './components/Header';
import ControlsPanel from './components/ControlsPanel';
import PromptControlsPanel from './components/PromptControlsPanel';
import GalleryPanel from './components/GalleryPanel';
import Footer from './components/Footer';
import MediaModal from './components/ImageModal';
import Card from './components/Card';
import { CameraIcon } from './components/icons/CameraIcon';
import { AspectRatioIcon } from './components/icons/AspectRatioIcon';
import { TickIcon } from './components/icons/TickIcon';


declare global {
    interface Window {
        JSZip: any;
    }
}

const applyWatermark = (baseImageSrc: string, logoFile: File, position: LogoPosition): Promise<string> => {
    return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            return reject(new Error('Không thể lấy context của canvas'));
        }

        const baseImage = new Image();
        baseImage.crossOrigin = "anonymous";
        baseImage.onload = () => {
            canvas.width = baseImage.width;
            canvas.height = baseImage.height;
            ctx.drawImage(baseImage, 0, 0);

            const logoImage = new Image();
            logoImage.onload = () => {
                const logoAspectRatio = logoImage.width / logoImage.height;
                const logoWidth = baseImage.width * 0.15; // Logo width is 15% of image width
                const logoHeight = logoWidth / logoAspectRatio;
                const padding = baseImage.width * 0.025; // Padding is 2.5% of image width

                let x = 0;
                let y = 0;

                switch (position) {
                    case 'top-left':
                        x = padding;
                        y = padding;
                        break;
                    case 'top-right':
                        x = baseImage.width - logoWidth - padding;
                        y = padding;
                        break;
                    case 'bottom-left':
                        x = padding;
                        y = baseImage.height - logoHeight - padding;
                        break;
                    case 'bottom-right':
                        x = baseImage.width - logoWidth - padding;
                        y = baseImage.height - logoHeight - padding;
                        break;
                }

                ctx.globalAlpha = 0.85; // Set logo opacity
                ctx.drawImage(logoImage, x, y, logoWidth, logoHeight);
                ctx.globalAlpha = 1.0; // Reset alpha

                resolve(canvas.toDataURL('image/png'));
                URL.revokeObjectURL(logoImage.src); // Clean up object URL
            };
            logoImage.onerror = (err) => {
                reject(err);
                URL.revokeObjectURL(logoImage.src);
            }
            logoImage.src = URL.createObjectURL(logoFile);
        };
        baseImage.onerror = reject;
        baseImage.src = baseImageSrc;
    });
};

type Tab = 'advanced' | 'prompt' | 'video';

interface VideoControlsPanelProps {
    formState: VideoFormState;
    onStateChange: (updates: Partial<VideoFormState>) => void;
    onGenerate: () => void;
    onStartOver: () => void;
    isLoading: boolean;
    elapsedTime: number;
    error: string | null;
    generationProgress: { current?: number; total?: number; message?: string } | null;
}

const VideoControlsPanel: React.FC<VideoControlsPanelProps> = ({ formState, onStateChange, onGenerate, onStartOver, isLoading, elapsedTime, error, generationProgress }) => {
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
            
            <div>
                <h2 className="text-lg font-bold text-red-600 bg-green-200 rounded-lg p-2 flex items-center gap-2">
                    <CameraIcon className="w-6 h-6 text-black" />
                    <span>TẢI ẢNH THAM CHIẾU</span>
                </h2>
                <div className="mt-4">
                     <input type="file" accept="image/*" ref={inputRef} className="hidden" onChange={handleFileChange} />
                     {!formState.image ? (
                        <div
                            className="w-full h-[140px] border-2 border-dashed border-border-color rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-primary-red transition-colors"
                            onClick={() => inputRef.current?.click()}
                        >
                            <p className="text-body-text">Nhấp để tải lên</p>
                            <p className="text-muted-text text-xs mt-1">Chọn 1 ảnh để tạo video</p>
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

            <div>
                 <h2 className="text-lg font-bold text-blue-700 bg-orange-200 rounded-lg p-2 flex items-center gap-2">
                    <span className="text-xl">✏️</span>
                    <span>PROMPT</span>
                </h2>
                <div className="mt-4">
                    <textarea
                        rows={4}
                        className="p-3 block w-full rounded-lg border border-border-color bg-input-bg shadow-subtle-inner focus:border-primary-red focus:ring-primary-red transition"
                        placeholder="Ví dụ: a cat driving a car"
                        value={formState.prompt}
                        onChange={(e) => onStateChange({ prompt: e.target.value })}
                    />
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
                                {generationProgress?.message 
                                    ? `${generationProgress.message} (${elapsedTime}s)`
                                    : `Đang xử lý... (${elapsedTime}s)`
                                }
                            </span>
                        </div>
                    ) : 'TẠO VIDEO VEO 3'}
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


const App: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>('advanced');
    const [advancedFormState, setAdvancedFormState] = useState<FormState>(INITIAL_FORM_STATE);
    const [promptFormState, setPromptFormState] = useState<PromptFormState>(INITIAL_PROMPT_FORM_STATE);
    const [videoFormState, setVideoFormState] = useState<VideoFormState>(INITIAL_VIDEO_FORM_STATE);
    const [generatedMedia, setGeneratedMedia] = useState<GeneratedMedia[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [viewingMedia, setViewingMedia] = useState<GeneratedMedia | null>(null);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [generationProgress, setGenerationProgress] = useState<{ current?: number; total?: number, message?: string } | null>(null);


    useEffect(() => {
        let timerId: number | undefined;
        if (isLoading) {
            setElapsedTime(0);
            timerId = window.setInterval(() => {
                setElapsedTime(prevTime => prevTime + 1);
            }, 1000);
        }
        
        return () => {
            if (timerId) {
                clearInterval(timerId);
            }
        };
    }, [isLoading]);

    const updateAdvancedFormState = useCallback((updates: Partial<FormState>) => {
        setAdvancedFormState(prev => ({ ...prev, ...updates }));
    }, []);

    const updatePromptFormState = useCallback((updates: Partial<PromptFormState>) => {
        setPromptFormState(prev => ({ ...prev, ...updates }));
    }, []);

    const updateVideoFormState = useCallback((updates: Partial<VideoFormState>) => {
        setVideoFormState(prev => ({ ...prev, ...updates }));
    }, []);

    const handleGenerate = async () => {
        setError(null);
        setIsLoading(true);
        setGeneratedMedia([]);
        setGenerationProgress(null);
        
        try {
            if (activeTab === 'advanced') {
                const onImageGenerated = async (src: string) => {
                    let finalSrc = src;
                    if (advancedFormState.logoImage) {
                        finalSrc = await applyWatermark(src, advancedFormState.logoImage!, advancedFormState.logoPosition);
                    }

                    const newImage: GeneratedMedia = {
                        id: `img-${Date.now()}-${Math.random()}`,
                        src: finalSrc,
                        type: 'image',
                    };
                    setGeneratedMedia(prev => [...prev, newImage]);
                };

                const onProgressUpdate = (current: number, total: number) => {
                    setGenerationProgress({ current, total });
                };
                
                if (advancedFormState.images.length === 0) {
                    throw new Error("Vui lòng tải lên ít nhất một ảnh tham chiếu.");
                }
                if (advancedFormState.characterDesc.length === 0) {
                    throw new Error("Vui lòng chọn ít nhất một mô tả nhân vật.");
                }
                await generateCharacterImages(advancedFormState, onImageGenerated, onProgressUpdate);

            } else if (activeTab === 'prompt') {
                 const onImageGenerated = (src: string) => {
                    const newMedia: GeneratedMedia = {
                        id: `img-${Date.now()}-${Math.random()}`,
                        src,
                        type: 'image',
                    };
                    setGeneratedMedia(prev => [...prev, newMedia]);
                 };

                 const onProgressUpdate = (current: number, total: number) => {
                    setGenerationProgress({ current, total });
                 };
                
                 if (promptFormState.images.length === 0) {
                    throw new Error("Vui lòng tải lên ít nhất một ảnh tham chiếu.");
                }
                if (!promptFormState.prompt.trim()) {
                    throw new Error("Vui lòng nhập prompt để tạo ảnh.");
                }
                await generateImagesFromPrompt(promptFormState, onImageGenerated, onProgressUpdate);
            } else if (activeTab === 'video') {
                const onVideoGenerated = (src: string) => {
                    const newMedia: GeneratedMedia = {
                        id: `vid-${Date.now()}-${Math.random()}`,
                        src,
                        type: 'video',
                    };
                    setGeneratedMedia(prev => [...prev, newMedia]);
                };

                const onProgressUpdate = (message: string) => {
                    setGenerationProgress({ message });
                };

                await generateVideoFromPrompt(videoFormState, onVideoGenerated, onProgressUpdate);
            }
            
        } catch (e) {
            console.error(e);
            setError(e instanceof Error ? e.message : "Đã xảy ra lỗi không xác định.");
        } finally {
            setIsLoading(false);
            setGenerationProgress(null);
        }
    };

    const handleStartOver = () => {
        if (activeTab === 'advanced') {
            setAdvancedFormState(INITIAL_FORM_STATE);
        } else if (activeTab === 'prompt') {
            setPromptFormState(INITIAL_PROMPT_FORM_STATE);
        } else if (activeTab === 'video') {
            setVideoFormState(INITIAL_VIDEO_FORM_STATE);
        }
        setGeneratedMedia([]);
        setError(null);
    };

    const handleDownloadAll = async () => {
        if (generatedMedia.length === 0) return;
        const zip = new window.JSZip();
        
        const mediaPromises = generatedMedia.map(async (media, index) => {
            const response = await fetch(media.src);
            const blob = await response.blob();
            const extension = media.type === 'image' ? 'png' : 'mp4';
            zip.file(`media_${index + 1}.${extension}`, blob);
        });

        await Promise.all(mediaPromises);

        zip.generateAsync({ type: "blob" }).then((content: Blob) => {
            const url = URL.createObjectURL(content);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'generated-media.zip';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
    };

    const handleViewMedia = (media: GeneratedMedia) => {
        setViewingMedia(media);
    };

    const handleCloseModal = () => {
        setViewingMedia(null);
    };

    const handleShareMedia = async (media: GeneratedMedia) => {
        if (!navigator.share) {
            alert('Chức năng chia sẻ không được hỗ trợ trên trình duyệt này.');
            return;
        }

        try {
            const response = await fetch(media.src);
            const blob = await response.blob();
            const extension = media.type === 'image' ? 'png' : 'mp4';
            const filename = `generated-media.${extension}`;
            const file = new File([blob], filename, { type: blob.type });

            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    title: 'Ảnh tạo bởi AI',
                    text: 'Hãy xem ảnh/video tôi đã tạo bằng AI!',
                    files: [file],
                });
            } else {
                 alert('Không thể chia sẻ tệp này.');
            }
        } catch (error) {
            console.error('Lỗi khi chia sẻ:', error);
            if ((error as DOMException).name !== 'AbortError') {
                 setError('Đã xảy ra lỗi khi cố gắng chia sẻ.');
            }
        }
    };
    
    const TabButton: React.FC<{tabId: Tab, children: React.ReactNode}> = ({ tabId, children }) => (
        <button
            onClick={() => setActiveTab(tabId)}
            className={`px-6 py-3 text-base font-bold transition-all duration-200 focus:outline-none ${
                activeTab === tabId
                ? 'text-primary-red border-b-2 border-primary-red'
                : 'text-muted-text hover:text-body-text border-b-2 border-transparent'
            }`}
        >
            {children}
        </button>
    );

    return (
        <div className="bg-page-bg text-body-text font-sans min-h-screen flex flex-col items-center p-6">
            <div className="w-full max-w-[1180px]">
                <Header />
                <main className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8 items-start">
                    <div className="md:col-span-3">
                        <div className="flex bg-panel-bg/80 backdrop-blur-sm rounded-t-xl border-b border-border-color">
                           <TabButton tabId="advanced">TÙY CHỈNH NÂNG CAO</TabButton>
                           <TabButton tabId="prompt">TẠO ẢNH THEO PROMPT</TabButton>
                           <TabButton tabId="video">TẠO VIDEO</TabButton>
                        </div>
                        {activeTab === 'advanced' ? (
                            <ControlsPanel
                                formState={advancedFormState}
                                onStateChange={updateAdvancedFormState}
                                onGenerate={handleGenerate}
                                onStartOver={handleStartOver}
                                isLoading={isLoading}
                                elapsedTime={elapsedTime}
                                error={error}
                                generationProgress={generationProgress}
                            />
                        ) : activeTab === 'prompt' ? (
                            <PromptControlsPanel
                                formState={promptFormState}
                                onStateChange={updatePromptFormState}
                                onGenerate={handleGenerate}
                                onStartOver={handleStartOver}
                                isLoading={isLoading}
                                elapsedTime={elapsedTime}
                                error={error}
                                generationProgress={generationProgress}
                            />
                        ) : (
                             <VideoControlsPanel
                                formState={videoFormState}
                                onStateChange={updateVideoFormState}
                                onGenerate={handleGenerate}
                                onStartOver={handleStartOver}
                                isLoading={isLoading}
                                elapsedTime={elapsedTime}
                                error={error}
                                generationProgress={generationProgress}
                            />
                        )}
                    </div>
                    <div className="md:col-span-1 md:sticky md:top-6">
                        <GalleryPanel
                            media={generatedMedia}
                            onDownloadAll={handleDownloadAll}
                            onViewMedia={handleViewMedia}
                            onShareMedia={handleShareMedia}
                        />
                    </div>
                </main>
                <Footer />
            </div>
            {viewingMedia && (
                <MediaModal 
                    media={viewingMedia} 
                    onClose={handleCloseModal}
                    onShareMedia={handleShareMedia}
                />
            )}
        </div>
    );
};

export default App;