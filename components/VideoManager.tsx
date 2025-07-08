'use client';

import React, { useState, useEffect } from 'react';
import api from '@/utils/api';
import { Video } from '@/types';

interface VideoManagerProps {
  token: string;
}

export default function VideoManager({ token }: VideoManagerProps) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    youtube_url: '',
    category: 'Photography',
    client: '',
    status: 'published',
    featured: false,
    sort_order: 0,
    video_type: 'youtube' as 'youtube' | 'file',
  });

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedVideoData, setUploadedVideoData] = useState<any>(null);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await api.get('/videos');
      setVideos(response.data || []);
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
  };

  // YouTube動画IDを抽出
  const getYouTubeId = (url: string): string | null => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
    return match ? match[1] : null;
  };

  // YouTubeサムネイルURLを取得
  const getYouTubeThumbnail = (url: string): string | null => {
    const videoId = getYouTubeId(url);
    if (videoId) {
      return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
    }
    return null;
  };

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    setUploadProgress(0);
    
    try {
      console.log('Starting file upload:', {
        name: file.name,
        type: file.type,
        size: file.size,
        sizeInMB: (file.size / (1024 * 1024)).toFixed(2) + 'MB'
      });
      
      const formData = new FormData();
      formData.append('video', file);
      
      const response = await fetch('/api/upload/video', {
        method: 'POST',
        body: formData,
      });
      
      const responseData = await response.json();
      console.log('Upload response:', responseData);
      
      if (!response.ok) {
        const errorMessage = responseData.error || 'アップロードに失敗しました';
        const errorDetails = responseData.details ? `\n詳細: ${responseData.details}` : '';
        throw new Error(errorMessage + errorDetails);
      }
      
      setUploadedVideoData(responseData.data);
      setUploadProgress(100);
      
      return responseData.data;
    } catch (error) {
      console.error('Upload error:', error);
      const errorMessage = error instanceof Error ? error.message : 'ファイルのアップロードに失敗しました';
      alert(errorMessage);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let videoData: any = {
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
          const uploadResult = await handleFileUpload(uploadedFile);
          if (!uploadResult) {
            setLoading(false);
            return;
          }
          setUploadedVideoData(uploadResult);
        }
        
        if (uploadedVideoData) {
          videoData.video_file_path = uploadedVideoData.path;
          videoData.thumbnail_file_path = uploadedVideoData.thumbnailPath;
          videoData.file_size = uploadedVideoData.size;
          videoData.mime_type = uploadedVideoData.type;
        }
      }

      if (editingVideo) {
        await api.put(`/videos/${editingVideo.id}`, videoData);
      } else {
        await api.post('/videos', videoData);
      }

      await fetchVideos();
      resetForm();
      setIsModalOpen(false);
      
      // 新しいタブでサイトを開く
      window.open('/', '_blank');
    } catch (error) {
      console.error('Error saving video:', error);
      alert('保存に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (video: Video) => {
    setEditingVideo(video);
    setFormData({
      title: video.title,
      description: video.description,
      youtube_url: video.video_url,
      category: video.category,
      client: video.client || '',
      status: video.status,
      featured: video.featured,
      sort_order: video.sort_order,
      video_type: video.video_type || 'youtube',
    });
    setUploadedFile(null);
    setUploadedVideoData(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('この作品を削除しますか？')) return;

    try {
      await api.delete(`/videos/${id}`);
      await fetchVideos();
    } catch (error) {
      console.error('Error deleting video:', error);
      alert('削除に失敗しました');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      youtube_url: '',
      category: 'Photography',
      client: '',
      status: 'published',
      featured: false,
      sort_order: 0,
      video_type: 'youtube',
    });
    setEditingVideo(null);
    setUploadedFile(null);
    setUploadedVideoData(null);
    setUploadProgress(0);
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

      {/* 作品一覧 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {videos.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px', color: '#666' }}>
            まだ作品が登録されていません
          </div>
        ) : (
          videos.map(video => (
            <div key={video.id} style={{
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
                    onClick={() => handleEdit(video)}
                    className="admin-btn admin-btn-secondary"
                    style={{ flex: 1, fontSize: '12px', padding: '6px 12px' }}
                  >
                    編集
                  </button>
                  <button
                    onClick={() => handleDelete(video.id)}
                    className="admin-btn admin-btn-danger"
                    style={{ fontSize: '12px', padding: '6px 12px' }}
                  >
                    削除
                  </button>
                </div>
              </div>
            </div>
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

            <form onSubmit={handleSubmit}>
              <div className="profile-form-group">
                <label className="profile-form-label">タイトル *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="profile-form-input"
                  required
                />
              </div>

              <div className="profile-form-group">
                <label className="profile-form-label">動画の種類 *</label>
                <div style={{ display: 'flex', gap: '20px', marginBottom: '10px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="radio"
                      value="youtube"
                      checked={formData.video_type === 'youtube'}
                      onChange={(e) => setFormData({...formData, video_type: e.target.value as 'youtube' | 'file'})}
                    />
                    <span>YouTube URL</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="radio"
                      value="file"
                      checked={formData.video_type === 'file'}
                      onChange={(e) => setFormData({...formData, video_type: e.target.value as 'youtube' | 'file'})}
                    />
                    <span>動画ファイル</span>
                  </label>
                </div>
              </div>

              {formData.video_type === 'youtube' && (
                <div className="profile-form-group">
                  <label className="profile-form-label">YouTube URL</label>
                  <input
                    type="url"
                    value={formData.youtube_url}
                    onChange={(e) => setFormData({...formData, youtube_url: e.target.value})}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="profile-form-input"
                    required
                  />
                  {/* プレビュー */}
                  {formData.youtube_url && getYouTubeThumbnail(formData.youtube_url) && (
                    <div style={{ marginTop: '10px' }}>
                      <img 
                        src={getYouTubeThumbnail(formData.youtube_url)!}
                        alt="プレビュー"
                        style={{ width: '100%', maxWidth: '200px', borderRadius: '4px' }}
                      />
                    </div>
                  )}
                </div>
              )}

              {formData.video_type === 'file' && (
                <div className="profile-form-group">
                  <label className="profile-form-label">動画ファイル *</label>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setUploadedFile(file);
                        setUploadedVideoData(null);
                      }
                    }}
                    className="profile-form-input"
                    required={!editingVideo}
                  />
                  <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                    対応形式: MP4, MOV, AVI, WebM, OGG（最大500MB）
                  </div>
                  
                  {uploading && (
                    <div style={{ marginTop: '10px' }}>
                      <div style={{ background: '#f0f0f0', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ 
                          width: `${uploadProgress}%`, 
                          height: '20px', 
                          background: '#007bff',
                          transition: 'width 0.3s ease'
                        }}></div>
                      </div>
                      <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                        アップロード中... {uploadProgress}%
                      </div>
                    </div>
                  )}
                  
                  {uploadedVideoData && (
                    <div style={{ marginTop: '10px', padding: '10px', background: '#e8f5e8', borderRadius: '4px' }}>
                      <div style={{ fontSize: '12px', color: '#059862' }}>
                        ✅ アップロード完了: {uploadedVideoData.originalName}
                      </div>
                      {uploadedVideoData.thumbnailPath && (
                        <img 
                          src={uploadedVideoData.thumbnailPath}
                          alt="サムネイル"
                          style={{ width: '100%', maxWidth: '150px', borderRadius: '4px', marginTop: '5px' }}
                        />
                      )}
                    </div>
                  )}
                </div>
              )}

              <div className="profile-form-group">
                <label className="profile-form-label">説明</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="profile-form-textarea"
                  rows={3}
                />
              </div>

              <div className="form-grid">
                <div className="profile-form-group">
                  <label className="profile-form-label">カテゴリ</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="profile-form-input"
                  >
                    <option value="Photography">Photography</option>
                    <option value="Portrait">Portrait</option>
                    <option value="Wedding">Wedding</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Nature">Nature</option>
                    <option value="Street">Street</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="profile-form-group">
                  <label className="profile-form-label">ステータス</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="profile-form-input"
                  >
                    <option value="published">公開</option>
                    <option value="draft">下書き</option>
                  </select>
                </div>
              </div>

              <div className="profile-form-group">
                <label className="profile-form-label">クライアント</label>
                <input
                  type="text"
                  value={formData.client}
                  onChange={(e) => setFormData({...formData, client: e.target.value})}
                  className="profile-form-input"
                />
              </div>

              <div className="profile-form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                  />
                  <span>注目作品として表示</span>
                </label>
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="admin-btn admin-btn-secondary"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="admin-btn admin-btn-primary"
                >
                  {loading ? '保存中...' : '保存'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}