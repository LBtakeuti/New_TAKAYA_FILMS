import React, { useState, useEffect } from 'react';
import { Video } from '@/types';
import { getYouTubeId } from '@/utils/youtube';

interface VideoFormProps {
  initialData?: Video | null;
  onSubmit: (data: VideoFormData) => Promise<void>;
  onCancel: () => void;
  uploadedVideoData?: {
    path: string;
    thumbnailPath: string | null;
    size: number;
    type: string;
    originalName: string;
  } | null;
  onFileSelect: (file: File) => void;
  uploading?: boolean;
  uploadProgress?: number;
}

export interface VideoFormData {
  title: string;
  description: string;
  youtube_url: string;
  category: string;
  client: string;
  status: string;
  featured: boolean;
  sort_order: number;
  video_type: 'youtube' | 'file';
  video_file_path?: string;
  thumbnail_file_path?: string | null;
  file_size?: number;
  mime_type?: string;
}

export default function VideoForm({ 
  initialData, 
  onSubmit, 
  onCancel,
  uploadedVideoData,
  onFileSelect,
  uploading = false,
  uploadProgress = 0
}: VideoFormProps) {
  const [formData, setFormData] = useState<VideoFormData>({
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

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        description: initialData.description,
        youtube_url: initialData.video_url,
        category: initialData.category,
        client: initialData.client || '',
        status: initialData.status,
        featured: initialData.featured,
        sort_order: initialData.sort_order,
        video_type: initialData.video_type || 'youtube',
      });
    }
  }, [initialData]);

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
      const submitData = { ...formData };
      
      if (formData.video_type === 'file' && uploadedVideoData) {
        submitData.video_file_path = uploadedVideoData.path;
        submitData.thumbnail_file_path = uploadedVideoData.thumbnailPath;
        submitData.file_size = uploadedVideoData.size;
        submitData.mime_type = uploadedVideoData.type;
      }

      await onSubmit(submitData);
    } finally {
      setLoading(false);
    }
  };

  return (
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
                onFileSelect(file);
              }
            }}
            className="profile-form-input"
            required={!initialData}
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
          onClick={onCancel}
          className="admin-btn admin-btn-secondary"
        >
          キャンセル
        </button>
        <button
          type="submit"
          disabled={loading || uploading}
          className="admin-btn admin-btn-primary"
        >
          {loading ? '保存中...' : '保存'}
        </button>
      </div>
    </form>
  );
}