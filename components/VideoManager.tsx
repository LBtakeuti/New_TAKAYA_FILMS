'use client';

import React, { useState } from 'react';
import { Video } from '@/types';
import { useVideos } from '@/hooks/useVideos';
import { useVideoUpload } from '@/hooks/useVideoUpload';
import VideoCard from './VideoCard';
import VideoForm, { VideoFormData } from './VideoForm';
import { logger } from '@/utils/logger';

interface VideoManagerProps {
  token: string;
}

export default function VideoManager({ token }: VideoManagerProps) {
  const { videos, loading, error, createVideo, updateVideo, deleteVideo } = useVideos();
  const { uploading, uploadProgress, uploadedVideoData, uploadVideo, resetUpload } = useVideoUpload();
  
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleSubmit = async (formData: VideoFormData) => {
    try {
      const videoData: Record<string, any> = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        client: formData.client,
        status: formData.status,
        featured: formData.featured,
        sort_order: formData.sort_order,
        video_type: formData.video_type,
      };
      
      if (formData.video_type === 'youtube') {
        videoData.youtube_url = formData.youtube_url;
      } else if (formData.video_type === 'file') {
        if (uploadedFile && !uploadedVideoData) {
          const uploadResult = await uploadVideo(uploadedFile);
          if (!uploadResult) {
            return;
          }
        }
        
        if (uploadedVideoData) {
          videoData.video_file_path = uploadedVideoData.path;
          videoData.thumbnail_file_path = uploadedVideoData.thumbnailPath;
          videoData.file_size = uploadedVideoData.size;
          videoData.mime_type = uploadedVideoData.type;
        }
      }

      if (editingVideo) {
        await updateVideo(editingVideo.id, videoData);
      } else {
        await createVideo(videoData);
      }

      resetForm();
      setIsModalOpen(false);
      
      // 新しいタブでサイトを開く
      window.open('/', '_blank');
    } catch (error) {
      logger.error('Error saving video:', error);
      alert('保存に失敗しました');
    }
  };

  const handleEdit = (video: Video) => {
    setEditingVideo(video);
    setUploadedFile(null);
    resetUpload();
    setIsModalOpen(true);
  };

  const handleFileSelect = (file: File) => {
    setUploadedFile(file);
    resetUpload();
  };

  const resetForm = () => {
    setEditingVideo(null);
    setUploadedFile(null);
    resetUpload();
  };

  return (
    <div className="profile-manager">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2>作品管理</h2>
        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="admin-btn admin-btn-primary"
        >
          新しい作品を追加
        </button>
      </div>

      {/* エラー表示 */}
      {error && (
        <div style={{ 
          background: '#fee', 
          color: '#c33', 
          padding: '10px', 
          borderRadius: '4px', 
          marginBottom: '20px' 
        }}>
          {error}
        </div>
      )}

      {/* 作品一覧 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {loading && videos.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px', color: '#666' }}>
            読み込み中...
          </div>
        ) : videos.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px', color: '#666' }}>
            まだ作品が登録されていません
          </div>
        ) : (
          videos.map(video => (
            <VideoCard
              key={video.id}
              video={video}
              onEdit={handleEdit}
              onDelete={deleteVideo}
            />
          ))
        )}
      </div>

      {/* モーダル */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: '#fff',
            borderRadius: '8px',
            padding: '30px',
            width: '90%',
            maxWidth: '500px',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <h3 style={{ margin: '0 0 20px 0' }}>
              {editingVideo ? '作品を編集' : '新しい作品を追加'}
            </h3>

            <VideoForm
              initialData={editingVideo}
              onSubmit={handleSubmit}
              onCancel={() => setIsModalOpen(false)}
              uploadedVideoData={uploadedVideoData}
              onFileSelect={handleFileSelect}
              uploading={uploading}
              uploadProgress={uploadProgress}
            />
          </div>
        </div>
      )}
    </div>
  );
}