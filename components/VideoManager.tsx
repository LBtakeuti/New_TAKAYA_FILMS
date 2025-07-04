'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import api from '../utils/api';

interface Video {
  id: number;
  title: string;
  description: string;
  video_url: string;
  thumbnail_url: string;
  category: string;
  client: string;
  project_date: string;
  status: string;
  featured: boolean;
  sort_order: number;
  created_at: string;
}

interface VideoManagerProps {
  token: string;
}

function VideoManager({ token }: VideoManagerProps) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    client: '',
    project_date: '',
    status: 'published',
    featured: false,
    sort_order: 0,
    youtube_url: '',
    video_file: null as File | null
  });

  const fetchVideos = useCallback(async () => {
    try {
      const response = await api.get('/videos?t=' + Date.now());
      setVideos(response.data || []);
    } catch (error) {
      // エラーは既にapi.tsのinterceptorでログ出力されているため、ここでは重複ログを避ける
      setVideos([]);
    }
  }, []);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // YouTube URLの検証
      if (!formData.title) {
        alert('タイトルを入力してください');
        setLoading(false);
        return;
      }

      if (!formData.youtube_url && !formData.video_file) {
        alert('YouTube URLまたは動画ファイルを指定してください');
        setLoading(false);
        return;
      }

      const videoData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        client: formData.client,
        status: formData.status,
        featured: formData.featured,
        sort_order: formData.sort_order,
        youtube_url: formData.youtube_url || '',
        video_url: formData.youtube_url || ''
      };

      let response;
      if (editingVideo) {
        response = await api.put(`/videos/${editingVideo.id}`, videoData);
      } else {
        response = await api.post('/videos', videoData);
      }

      // 保存成功
      console.log('Video saved successfully:', response.data);
      
      // 成功後の処理を少し遅延させる
      setTimeout(() => {
        fetchVideos();
        resetForm();
        setIsModalOpen(false);
        alert('動画を保存しました！');
        
        // 新しいタブでサイトを開く
        window.open('/', '_blank');
      }, 100);
    } catch (error: any) {
      // エラーは既にapi.tsのinterceptorでログ出力されている
      
      let errorMessage = 'エラーが発生しました';
      if (error.userMessage) {
        errorMessage = error.userMessage;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      // CORSエラーの場合の特別な処理
      if (error.message && error.message.includes('Network Error')) {
        errorMessage = '保存中にエラーが発生しました。ページを再読み込みしてください。';
      }
      
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (video: Video) => {
    setEditingVideo(video);
    setFormData({
      title: video.title || '',
      description: video.description || '',
      category: video.category || '',
      client: video.client || '',
      project_date: video.project_date || '',
      status: video.is_published ? 'published' : 'draft',
      featured: video.is_featured || false,
      sort_order: video.sort_order || 0,
      youtube_url: (video.video_url && video.video_url.includes('youtube')) ? video.video_url : '',
      video_file: null
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('この動画を削除しますか？')) return;

    try {
      await api.delete(`/videos/${id}`);
      fetchVideos();
      alert('動画を削除しました');
    } catch (error) {
      // エラーは既にapi.tsのinterceptorでログ出力されている
      alert('削除エラーが発生しました');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      client: '',
      project_date: '',
      status: 'published',
      featured: false,
      sort_order: 0,
      youtube_url: '',
      video_file: null
    });
    setEditingVideo(null);
  };

  const isYouTubeUrl = (url: string) => {
    return url.includes('youtube.com') || url.includes('youtu.be');
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

  return (
    <div style={{ padding: '0' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <p style={{ margin: 0, color: '#ccc', fontSize: '14px' }}>動画の追加・編集・削除ができます</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          style={{
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = '#2563eb';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = '#3b82f6';
          }}
        >
          + 新しい動画を追加
        </button>
      </div>

      {/* Videos Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '20px'
      }}>
        {videos.length === 0 ? (
          <div style={{
            gridColumn: '1 / -1',
            textAlign: 'center',
            padding: '60px',
            color: '#ccc',
            background: '#2a2a2a',
            borderRadius: '8px'
          }}>
            まだ動画が登録されていません。新しい動画を追加してください。
          </div>
        ) : (
          videos.map(video => (
            <div key={video.id} style={{
              background: '#2a2a2a',
              borderRadius: '8px',
              overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
            }}>
            {/* Thumbnail */}
            <div style={{
              width: '100%',
              height: '180px',
              background: '#000',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {isYouTubeUrl(video.video_url) && getYouTubeThumbnail(video.video_url) ? (
                <img 
                  src={getYouTubeThumbnail(video.video_url)!}
                  alt={video.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <div style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#666',
                  background: '#1a1a1a'
                }}>
                  {isYouTubeUrl(video.video_url) ? '📺 YouTube' : '🎬 Video'}
                </div>
              )}
            </div>

            {/* Content */}
            <div style={{ padding: '20px' }}>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '1.1rem', color: '#fff' }}>
                {video.title}
              </h3>
              <p style={{ color: '#ccc', fontSize: '0.9rem', marginBottom: '15px' }}>
                {video.category} {video.client && `• ${video.client}`}
              </p>
              
              {/* Actions */}
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => handleEdit(video)}
                  style={{
                    flex: 1,
                    background: '#3a3a3a',
                    color: '#fff',
                    border: '1px solid #555',
                    padding: '8px',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = '#4a4a4a';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = '#3a3a3a';
                  }}
                >
                  編集
                </button>
                <button
                  onClick={() => handleDelete(video.id)}
                  style={{
                    background: '#dc3545',
                    color: 'white',
                    border: 'none',
                    padding: '8px 12px',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  削除
                </button>
              </div>
            </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
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
            background: '#2a2a2a',
            borderRadius: '8px',
            padding: '30px',
            width: '90%',
            maxWidth: '500px',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <h3 style={{ margin: '0 0 20px 0', color: '#fff' }}>
              {editingVideo ? '動画を編集' : '新しい動画を追加'}
            </h3>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: '#ccc' }}>
                  タイトル *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '10px',
                    background: '#3a3a3a',
                    color: '#fff',
                    border: '1px solid #555',
                    borderRadius: '4px',
                    boxSizing: 'border-box'
                  }}
                  required
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: '#ccc' }}>
                  YouTube URL
                </label>
                <input
                  type="url"
                  value={formData.youtube_url}
                  onChange={(e) => setFormData({...formData, youtube_url: e.target.value})}
                  placeholder="https://www.youtube.com/watch?v=..."
                  style={{
                    width: '100%',
                    padding: '10px',
                    background: '#3a3a3a',
                    color: '#fff',
                    border: '1px solid #555',
                    borderRadius: '4px',
                    boxSizing: 'border-box'
                  }}
                />
                {/* YouTube URLプレビュー */}
                {formData.youtube_url && isYouTubeUrl(formData.youtube_url) && getYouTubeThumbnail(formData.youtube_url) && (
                  <div style={{ marginTop: '10px' }}>
                    <img 
                      src={getYouTubeThumbnail(formData.youtube_url)!}
                      alt="プレビュー"
                      style={{
                        width: '100%',
                        maxWidth: '200px',
                        height: 'auto',
                        borderRadius: '4px',
                        border: '1px solid #555'
                      }}
                    />
                  </div>
                )}
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: '#ccc' }}>
                  または動画ファイルをアップロード
                </label>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => setFormData({...formData, video_file: e.target.files?.[0] || null})}
                  style={{
                    width: '100%',
                    padding: '10px',
                    background: '#3a3a3a',
                    color: '#fff',
                    border: '1px solid #555',
                    borderRadius: '4px',
                    boxSizing: 'border-box'
                  }}
                />
                {formData.video_file && (
                  <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '5px' }}>
                    選択されたファイル: {formData.video_file.name}
                  </p>
                )}
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: '#ccc' }}>
                  説明
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '10px',
                    background: '#3a3a3a',
                    color: '#fff',
                    border: '1px solid #555',
                    borderRadius: '4px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: '#ccc' }}>
                    カテゴリ
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: '#3a3a3a',
                      color: '#fff',
                      border: '1px solid #555',
                      borderRadius: '4px'
                    }}
                  >
                    <option value="">選択してください</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Music Video">Music Video</option>
                    <option value="Documentary">Documentary</option>
                    <option value="Wedding">Wedding</option>
                    <option value="Corporate">Corporate</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: '#ccc' }}>
                    ステータス
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: '#3a3a3a',
                      color: '#fff',
                      border: '1px solid #555',
                      borderRadius: '4px'
                    }}
                  >
                    <option value="published">公開</option>
                    <option value="draft">下書き</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: '#ccc' }}>
                  クライアント
                </label>
                <input
                  type="text"
                  value={formData.client}
                  onChange={(e) => setFormData({...formData, client: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '10px',
                    background: '#3a3a3a',
                    color: '#fff',
                    border: '1px solid #555',
                    borderRadius: '4px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                  />
                  <span style={{ fontSize: '14px' }}>注目作品として表示</span>
                </label>
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    padding: '10px 20px',
                    border: '1px solid #555',
                    background: '#3a3a3a',
                    color: '#fff',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = '#4a4a4a';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = '#3a3a3a';
                  }}
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    padding: '10px 20px',
                    background: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: loading ? 'not-allowed' : 'pointer'
                  }}
                  onMouseOver={(e) => {
                    if (!loading) e.currentTarget.style.background = '#2563eb';
                  }}
                  onMouseOut={(e) => {
                    if (!loading) e.currentTarget.style.background = '#3b82f6';
                  }}
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

export default VideoManager;