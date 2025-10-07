import React, { useEffect } from 'react';
import { CloseIcon } from './icons/CloseIcon';
import { GeneratedMedia } from '../types';
import { ShareIcon } from './icons/ShareIcon';

interface MediaModalProps {
    media: GeneratedMedia;
    onClose: () => void;
    onShareMedia: (media: GeneratedMedia) => void;
}

const MediaModal: React.FC<MediaModalProps> = ({ media, onClose, onShareMedia }) => {
    const isShareSupported = !!navigator.share;

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'hidden';

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [onClose]);

    return (
        <div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-fade-in"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="media-modal-title"
        >
            <div
                className="relative max-w-4xl max-h-[90vh] bg-panel-bg rounded-xl shadow-lg flex flex-col p-2"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 id="media-modal-title" className="sr-only">Media Preview</h2>
                <div className="absolute top-2 right-2 flex items-center gap-2 z-10">
                     {isShareSupported && (
                        <button
                            onClick={() => onShareMedia(media)}
                            className="text-muted-text hover:text-body-text transition-colors p-2 rounded-full bg-panel-bg/50 hover:bg-panel-bg"
                            aria-label="Share media"
                            title="Chia sẻ"
                        >
                            <ShareIcon className="w-6 h-6" />
                        </button>
                    )}
                    <button
                        onClick={onClose}
                        className="text-muted-text hover:text-body-text transition-colors p-2 rounded-full bg-panel-bg/50 hover:bg-panel-bg"
                        aria-label="Close media preview"
                    >
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </div>
                {media.type === 'image' ? (
                    <img
                        src={media.src}
                        alt="Enlarged view of generated media"
                        className="object-contain w-full h-full max-w-full max-h-[calc(90vh-1rem)] rounded-lg"
                    />
                ) : (
                     <video
                        src={media.src}
                        controls
                        autoPlay
                        className="object-contain w-full h-full max-w-full max-h-[calc(90vh-1rem)] rounded-lg"
                    />
                )}
            </div>
             <style>{`
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-fade-in {
                    animation: fade-in 0.2s ease-out;
                }
            `}</style>
        </div>
    );
};

export default MediaModal;