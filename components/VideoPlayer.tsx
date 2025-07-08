'use client';

import React, { useEffect } from 'react';

interface VideoPlayerProps {
  videoUrl: string;
  videoFilePath?: string;
  videoType?: 'youtube' | 'file';
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

export default function VideoPlayer({ videoUrl, videoFilePath, videoType = 'youtube', isOpen, onClose, title }: VideoPlayerProps) {
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
  const isYouTube = videoType === 'youtube' && videoId;
  const isFile = videoType === 'file' && videoFilePath;

  if (!isYouTube && !isFile) return null;

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
          {isYouTube && (
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
              title={title || 'Video Player'}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="video-player-iframe"
              style={{
                width: '100%',
                height: '100%',
                border: 'none'
              }}
            />
          )}
          
          {isFile && (
            <video
              src={videoFilePath}
              title={title || 'Video Player'}
              controls
              autoPlay
              className="video-player-video"
              style={{
                width: '100%',
                height: '100%',
                maxHeight: '80vh',
                objectFit: 'contain'
              }}
            >
              お使いのブラウザは動画再生に対応していません。
            </video>
          )}
        </div>
      </div>
    </div>
  );
}