import React from 'react';
import { Video } from '../types';

interface VideoPlayerModalProps {
  video: Video | null;
  isOpen: boolean;
  onClose: () => void;
}

const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({ video, isOpen, onClose }) => {
  if (!isOpen || !video) return null;

  const isYouTubeUrl = (url: string) => {
    return url.includes('youtube.com') || url.includes('youtu.be');
  };

  const isLocalVideoFile = (url: string) => {
    return url.startsWith('/uploads/') && (url.includes('.mp4') || url.includes('.mov') || url.includes('.avi') || url.includes('.wmv'));
  };

  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = getYouTubeVideoId(url);
    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&showinfo=0` : null;
  };

  const getYouTubeVideoId = (url: string) => {
    if (!url) return null;
    const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=)([^&\n?#]+)/);
    if (youtubeMatch) return youtubeMatch[1];
    const youtubeShortMatch = url.match(/(?:youtu\.be\/)([^&\n?#]+)/);
    if (youtubeShortMatch) return youtubeShortMatch[1];
    const embedMatch = url.match(/(?:youtube\.com\/embed\/)([^&\n?#]+)/);
    if (embedMatch) return embedMatch[1];
    return null;
  };

  const getLocalVideoUrl = (url: string) => {
    return `http://localhost:5001${url}`;
  };

  const renderVideoPlayer = () => {
    if (isYouTubeUrl(video.video_url)) {
      const embedUrl = getYouTubeEmbedUrl(video.video_url);
      return embedUrl ? (
        <iframe
          src={embedUrl}
          className="w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          title={video.title}
          style={{ minHeight: '400px' }}
          onError={() => console.error('YouTube iframe failed to load')}
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center text-white bg-gray-800">
          <p className="text-lg mb-4">YouTube動画の読み込みに失敗しました</p>
          <a 
            href={video.video_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white text-decoration-none"
          >
            YouTubeで開く
          </a>
        </div>
      );
    } else if (isLocalVideoFile(video.video_url)) {
      return (
        <video
          src={getLocalVideoUrl(video.video_url)}
          className="w-full h-full"
          controls
          autoPlay
          title={video.title}
          style={{ minHeight: '400px' }}
          onError={() => console.error('Local video failed to load')}
        >
          <p className="text-white">ブラウザが動画の再生をサポートしていません。</p>
        </video>
      );
    } else {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center text-white bg-gray-800">
          <p className="text-lg mb-4">サポートされていない動画形式です</p>
          <p className="text-sm text-gray-400">対応形式: YouTube URL, MP4, MOV, AVI, WMV</p>
        </div>
      );
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div className="relative w-full max-w-6xl max-h-[90vh] bg-black rounded-lg overflow-hidden shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-12 h-12 bg-black bg-opacity-70 hover:bg-opacity-90 rounded-full flex items-center justify-center text-white transition-all duration-200 hover:scale-110"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Video player */}
        <div 
          className="relative bg-black"
          style={{ aspectRatio: '16/9' }}
          onClick={(e) => e.stopPropagation()}
        >
          {renderVideoPlayer()}
        </div>

        {/* Video info */}
        <div className="p-6 bg-gray-900 text-white" onClick={(e) => e.stopPropagation()}>
          <h2 className="text-2xl font-bold mb-2">{video.title}</h2>
          {video.description && (
            <p className="text-gray-300 mb-4">{video.description}</p>
          )}
          <div className="flex flex-wrap gap-4 text-sm">
            <span className="bg-gray-800 px-3 py-1 rounded-full">{video.category}</span>
            {video.client && (
              <span className="text-gray-400">Client: {video.client}</span>
            )}
            {video.project_date && (
              <span className="text-gray-400">Date: {new Date(video.project_date).toLocaleDateString()}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayerModal;