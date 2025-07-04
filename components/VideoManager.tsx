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
  });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const videoData = {
        title: formData.title,
        description: formData.description,
        youtube_url: formData.youtube_url,
        category: formData.category,
        client: formData.client,
        status: formData.status,
        featured: formData.featured,
        sort_order: formData.sort_order,
      };

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
    });
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
    });
    setEditingVideo(null);
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
                {getYouTubeThumbnail(video.video_url) ? (
                  <img 
                    src={getYouTubeThumbnail(video.video_url)!}
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
                    📷 Photography
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
                <label className="profile-form-label">YouTube URL</label>
                <input
                  type="url"
                  value={formData.youtube_url}
                  onChange={(e) => setFormData({...formData, youtube_url: e.target.value})}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="profile-form-input"
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