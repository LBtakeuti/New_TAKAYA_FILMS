import React, { useState, useEffect } from 'react';
import api from '../utils/api-direct';
import { Profile } from '../types';
import Toast from './Toast';
import { useToast } from '../hooks/useToast';

interface ProfileManagerV2Props {
  token: string;
}

function ProfileManagerV2({ token }: ProfileManagerV2Props) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  const [serviceInput, setServiceInput] = useState('');
  const { toast, showToast, hideToast } = useToast();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    bio: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    social_links: {
      instagram: '',
      youtube: '',
      vimeo: '',
      linkedin: '',
      twitter: ''
    },
    skills: [] as string[],
    services: [] as string[]
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/profile');
      const data = response.data;
      console.log('Fetched profile:', data);
      
      setProfile(data);
      setFormData({
        name: data.name || '',
        title: data.title || '',
        bio: data.bio || '',
        email: data.email || '',
        phone: data.phone || '',
        location: data.location || '',
        website: data.website || '',
        social_links: data.social_links || {
          instagram: '',
          youtube: '',
          vimeo: '',
          linkedin: '',
          twitter: ''
        },
        skills: data.skills || [],
        services: data.services || []
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      showToast('プロフィールの取得に失敗しました', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      console.log('Saving profile data:', formData);
      
      const response = await api.put('/api/profile', formData);
      
      console.log('Save response:', response.data);
      
      if (response.data && (response.data.success || response.data.message)) {
        await fetchProfile();
        showToast('プロフィールを保存しました！メインサイトに反映されました。', 'success');
        
        // メインサイトをリフレッシュ（開発環境の場合）
        if (window.location.hostname === 'localhost') {
          setTimeout(() => {
            window.open('http://localhost:3000', '_blank');
          }, 1000);
        }
      }
    } catch (error: any) {
      console.error('Error saving profile:', error);
      const errorMessage = error.response?.data?.error || error.message || 'エラーが発生しました';
      showToast(errorMessage, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSocialLinkChange = (platform: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      social_links: {
        ...prev.social_links,
        [platform]: value
      }
    }));
  };

  const addSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, skillInput.trim()]
      });
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(skill => skill !== skillToRemove)
    });
  };

  const addService = () => {
    if (serviceInput.trim() && !formData.services.includes(serviceInput.trim())) {
      setFormData({
        ...formData,
        services: [...formData.services, serviceInput.trim()]
      });
      setServiceInput('');
    }
  };

  const removeService = (serviceToRemove: string) => {
    setFormData({
      ...formData,
      services: formData.services.filter(service => service !== serviceToRemove)
    });
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>読み込み中...</h2>
      </div>
    );
  }

  return (
    <div className="profile-manager" style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ color: '#fff', marginBottom: '30px' }}>プロフィール管理</h2>
      
      <form onSubmit={handleSubmit}>
        {/* 基本情報 */}
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ color: '#fff', marginBottom: '20px' }}>基本情報</h3>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#ccc' }}>名前</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                background: '#3a3a3a',
                color: '#fff',
                border: '1px solid #555',
                borderRadius: '6px',
                fontSize: '16px'
              }}
              required
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#ccc' }}>肩書き</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                background: '#3a3a3a',
                color: '#fff',
                border: '1px solid #555',
                borderRadius: '6px',
                fontSize: '16px'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#ccc' }}>自己紹介</label>
            <textarea
              value={formData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              rows={5}
              style={{
                width: '100%',
                padding: '12px',
                background: '#3a3a3a',
                color: '#fff',
                border: '1px solid #555',
                borderRadius: '6px',
                fontSize: '16px',
                resize: 'vertical'
              }}
            />
          </div>
        </div>

        {/* 連絡先情報 */}
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ color: '#fff', marginBottom: '20px' }}>連絡先情報</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: '#ccc' }}>メールアドレス</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: '#3a3a3a',
                  color: '#fff',
                  border: '1px solid #555',
                  borderRadius: '6px',
                  fontSize: '16px'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: '#ccc' }}>電話番号</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: '#3a3a3a',
                  color: '#fff',
                  border: '1px solid #555',
                  borderRadius: '6px',
                  fontSize: '16px'
                }}
              />
            </div>
          </div>

          <div style={{ marginTop: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#ccc' }}>所在地</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                background: '#3a3a3a',
                color: '#fff',
                border: '1px solid #555',
                borderRadius: '6px',
                fontSize: '16px'
              }}
            />
          </div>
        </div>

        {/* SNS・ウェブサイト */}
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ color: '#fff', marginBottom: '20px' }}>SNS・ウェブサイト</h3>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#ccc' }}>ウェブサイト</label>
            <input
              type="url"
              value={formData.website}
              onChange={(e) => handleInputChange('website', e.target.value)}
              placeholder="https://example.com"
              style={{
                width: '100%',
                padding: '12px',
                background: '#3a3a3a',
                color: '#fff',
                border: '1px solid #555',
                borderRadius: '6px',
                fontSize: '16px'
              }}
            />
          </div>

          {Object.entries({
            instagram: 'Instagram',
            youtube: 'YouTube',
            vimeo: 'Vimeo',
            linkedin: 'LinkedIn',
            twitter: 'Twitter'
          }).map(([key, label]) => (
            <div key={key} style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#ccc' }}>{label}</label>
              <input
                type="url"
                value={formData.social_links[key as keyof typeof formData.social_links]}
                onChange={(e) => handleSocialLinkChange(key, e.target.value)}
                placeholder={`https://${key}.com/username`}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: '#3a3a3a',
                  color: '#fff',
                  border: '1px solid #555',
                  borderRadius: '6px',
                  fontSize: '16px'
                }}
              />
            </div>
          ))}
        </div>

        {/* スキル */}
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ color: '#fff', marginBottom: '20px' }}>スキル</h3>
          
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
              placeholder="新しいスキルを入力"
              style={{
                flex: 1,
                padding: '8px 12px',
                background: '#3a3a3a',
                color: '#fff',
                border: '1px solid #555',
                borderRadius: '4px'
              }}
            />
            <button
              type="button"
              onClick={addSkill}
              style={{
                padding: '8px 20px',
                background: '#4CAF50',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              追加
            </button>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {formData.skills.map((skill, index) => (
              <span
                key={index}
                style={{
                  background: '#e8f5e9',
                  color: '#2e7d32',
                  padding: '6px 12px',
                  borderRadius: '16px',
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                {skill}
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#2e7d32',
                    cursor: 'pointer',
                    fontSize: '16px',
                    padding: '0',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* 提供サービス */}
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ color: '#fff', marginBottom: '20px' }}>提供サービス</h3>
          
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <input
              type="text"
              value={serviceInput}
              onChange={(e) => setServiceInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addService())}
              placeholder="新しいサービスを入力"
              style={{
                flex: 1,
                padding: '8px 12px',
                background: '#3a3a3a',
                color: '#fff',
                border: '1px solid #555',
                borderRadius: '4px'
              }}
            />
            <button
              type="button"
              onClick={addService}
              style={{
                padding: '8px 20px',
                background: '#4CAF50',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              追加
            </button>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {formData.services.map((service, index) => (
              <span
                key={index}
                style={{
                  background: '#e3f2fd',
                  color: '#1565c0',
                  padding: '6px 12px',
                  borderRadius: '16px',
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                {service}
                <button
                  type="button"
                  onClick={() => removeService(service)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#1565c0',
                    cursor: 'pointer',
                    fontSize: '16px',
                    padding: '0',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* 保存ボタン */}
        <div style={{ marginTop: '40px', textAlign: 'center' }}>
          <button
            type="submit"
            disabled={saving}
            style={{
              padding: '14px 40px',
              background: saving ? '#666' : '#3b82f6',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              cursor: saving ? 'not-allowed' : 'pointer',
              transition: 'background 0.3s'
            }}
          >
            {saving ? '保存中...' : 'プロフィールを保存'}
          </button>
        </div>
      </form>
      
      {toast.isVisible && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}
    </div>
  );
}

export default ProfileManagerV2;