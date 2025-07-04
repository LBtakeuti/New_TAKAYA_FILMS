'use client';

import React, { useEffect } from 'react';

interface VideoPlayerProps {
  videoUrl: string;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

export default function VideoPlayer({ videoUrl, isOpen, onClose, title }: VideoPlayerProps) {
  // YouTube動画IDを抽出
  const getYouTubeId = (url: string): string | null => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
    return match ? match[1] : null;
  };

  // ESCキーで閉じる
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const videoId = getYouTubeId(videoUrl);
  if (!videoId) return null;

  return (
    <div 
      className="video-player-overlay"
      onClick={onClose}
    >
      <div 
        className="video-player-container"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          className="video-player-close"
          onClick={onClose}
          aria-label="閉じる"
        >
          ×
        </button>
        
        {title && (
          <h2 className="video-player-title">{title}</h2>
        )}
        
        <div className="video-player-wrapper">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
            title={title || 'Video Player'}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="video-player-iframe"
          />
        </div>
      </div>
    </div>
  );
}