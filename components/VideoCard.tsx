import React from 'react';
import { Video } from '@/types';
import { getYouTubeId } from '@/utils/youtube';

interface VideoCardProps {
  video: Video;
  onEdit: (video: Video) => void;
  onDelete: (id: number) => void;
}

export default function VideoCard({ video, onEdit, onDelete }: VideoCardProps) {
  const getYouTubeThumbnail = (url: string): string | null => {
    const videoId = getYouTubeId(url);
    if (videoId) {
      return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
    }
    return null;
  };

  return (
    <div style={{
      border: '1px solid #ddd',
      borderRadius: '8px',
      overflow: 'hidden',
      background: '#fff'
    }}>
      {/* サムネイル */}
      <div style={{ height: '200px', background: '#f5f5f5', position: 'relative' }}>
        {video.video_type === 'youtube' && getYouTubeThumbnail(video.video_url) ? (
          <img 
            src={getYouTubeThumbnail(video.video_url)!}
            alt={video.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : video.video_type === 'file' && video.thumbnail_file_path ? (
          <img 
            src={video.thumbnail_file_path}
            alt={video.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '100%', 
            color: '#666' 
          }}>
            {video.video_type === 'file' ? '🎬' : '📷'} {video.category}
          </div>
        )}
        {video.video_type === 'file' && (
          <div style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            background: 'rgba(0,0,0,0.7)',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '12px'
          }}>
            📁 ファイル
          </div>
        )}
      </div>

      {/* 情報 */}
      <div style={{ padding: '15px' }}>
        <h3 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>{video.title}</h3>
        <p style={{ color: '#666', fontSize: '14px', margin: '0 0 15px 0' }}>
          {video.category} {video.client && `• ${video.client}`}
        </p>

        {/* アクション */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => onEdit(video)}
            className="admin-btn admin-btn-secondary"
            style={{ flex: 1, fontSize: '12px', padding: '6px 12px' }}
          >
            編集
          </button>
          <button
            onClick={() => onDelete(video.id)}
            className="admin-btn admin-btn-danger"
            style={{ fontSize: '12px', padding: '6px 12px' }}
          >
            削除
          </button>
        </div>
      </div>
    </div>
  );
}