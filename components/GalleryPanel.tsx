import React, { useState, useEffect } from 'react';
import Card from './Card';
import { GeneratedMedia } from '../types';
import { DownloadIcon } from './icons/DownloadIcon';
import { EyeIcon } from './icons/EyeIcon';
import { ChevronLeftIcon } from './icons/ChevronLeftIcon';
import { ChevronRightIcon } from './icons/ChevronRightIcon';
import { ShareIcon } from './icons/ShareIcon';

interface GalleryPanelProps {
    media: GeneratedMedia[];
    onDownloadAll: () => void;
    onViewMedia: (media: GeneratedMedia) => void;
    onShareMedia: (media: GeneratedMedia) => void;
}

const GalleryPanel: React.FC<GalleryPanelProps> = ({ media, onDownloadAll, onViewMedia, onShareMedia }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const isShareSupported = !!navigator.share;

    useEffect(() => {
        setCurrentIndex(0);
    }, [media]);

    const handleDownloadMedia = (mediaSrc: string, index: number, type: 'image' | 'video') => {
        const extension = type === 'image' ? 'png' : 'mp4';
        const a = document.createElement('a');
        a.href = mediaSrc;
        a.download = `media_${index + 1}.${extension}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % media.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + media.length) % media.length);
    };

    const renderContent = () => {
        if (media.length === 0) {
            return (
                <div className="h-full flex items-center justify-center text-center text-muted-text p-4">
                    <p>Ảnh hoặc video được tạo của bạn sẽ xuất hiện ở đây.</p>
                </div>
            );
        }

        const currentMedia = media[currentIndex];

        return (
            <div className="flex flex-col h-full">
                <div className="relative group flex-grow mb-4">
                    {currentMedia.type === 'image' ? (
                        <img
                            key={currentMedia.id}
                            src={currentMedia.src}
                            alt={`Generated media ${currentIndex + 1}`}
                            className="w-full h-full object-contain rounded-[10px] border border-border-color transition-opacity duration-300"
                        />
                    ) : (
                        <video
                            key={currentMedia.id}
                            src={currentMedia.src}
                            controls
                            className="w-full h-full object-contain rounded-[10px] border border-border-color"
                        />
                    )}
                    <div className="absolute bottom-2 right-2 flex items-center gap-2 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-200">
                         <button
                            onClick={() => onViewMedia(currentMedia)}
                            aria-label={`Xem media ${currentIndex + 1}`}
                            title="Xem"
                            className="bg-download-bg/80 backdrop-blur-sm border border-border-color rounded-lg p-2 text-body-text hover:bg-download-bg transition-all"
                        >
                            <EyeIcon />
                        </button>
                        {isShareSupported && (
                            <button
                                onClick={() => onShareMedia(currentMedia)}
                                aria-label={`Chia sẻ media ${currentIndex + 1}`}
                                title="Chia sẻ"
                                className="bg-download-bg/80 backdrop-blur-sm border border-border-color rounded-lg p-2 text-body-text hover:bg-download-bg transition-all"
                            >
                                <ShareIcon />
                            </button>
                        )}
                        <button
                            onClick={() => handleDownloadMedia(currentMedia.src, currentIndex, currentMedia.type)}
                            aria-label={`Tải xuống media ${currentIndex + 1}`}
                            title="Tải xuống"
                            className="bg-download-bg/80 backdrop-blur-sm border border-border-color rounded-lg p-2 text-body-text hover:bg-download-bg transition-all"
                        >
                            <DownloadIcon />
                        </button>
                    </div>
                </div>
                {media.length > 1 && (
                     <div className="flex items-center justify-center gap-4 flex-shrink-0">
                        <button 
                            onClick={handlePrev} 
                            className="p-2 rounded-full bg-input-bg border border-border-color hover:bg-border-color transition-colors"
                            aria-label="Media trước"
                        >
                            <ChevronLeftIcon className="w-5 h-5 text-body-text" />
                        </button>
                        <span className="font-medium text-sm text-muted-text tabular-nums">
                            {currentIndex + 1} / {media.length}
                        </span>
                        <button 
                            onClick={handleNext} 
                            className="p-2 rounded-full bg-input-bg border border-border-color hover:bg-border-color transition-colors"
                            aria-label="Media kế tiếp"
                        >
                            <ChevronRightIcon className="w-5 h-5 text-body-text" />
                        </button>
                    </div>
                )}
            </div>
        );
    };

    return (
        <Card className="bg-panel-bg flex flex-col max-h-[calc(100vh-48px)]">
            <div className="flex justify-end mb-4 flex-shrink-0">
                <button 
                    onClick={onDownloadAll}
                    disabled={media.length === 0}
                    className="bg-download-bg border border-border-color rounded-xl px-4 py-2 flex items-center gap-2 text-sm text-body-text hover:border-muted-text transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    <DownloadIcon />
                    Tải Xuống Tất Cả
                </button>
            </div>
            <div className="overflow-y-auto flex-grow">
              {renderContent()}
            </div>
        </Card>
    );
};

export default GalleryPanel;