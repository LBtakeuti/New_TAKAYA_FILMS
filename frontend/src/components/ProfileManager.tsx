import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Profile } from '../types';

interface ProfileManagerProps {
  token: string;
}

function ProfileManager({ token }: ProfileManagerProps) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  const [serviceInput, setServiceInput] = useState('');

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
    try {
      const response = await api.get('/profile');
      const data = response.data;
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
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // デバッグ用：テストエンドポイントを使用
      console.log('Sending profile data:', formData);
      
      const response = await api.put('/test-profile', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Response:', response.data);
      
      if (response.data && response.data.message) {
        // 本番エンドポイントに再度送信
        try {
          await api.put('/profile', formData, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          fetchProfile();
        } catch (mainError) {
          console.error('Main endpoint error:', mainError);
        }
        
        alert('プロフィールを更新しました');
      }
    } catch (error: any) {
      console.error('Error updating profile:', error);
      const errorMessage = error.response?.data?.error || error.message || 'エラーが発生しました';
      alert(`エラー: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
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

  return (
    <div style={{ padding: '0' }}>
      {/* Header */}
      <div style={{ marginBottom: '30px' }}>
        <p style={{ color: '#ccc', margin: '0', fontSize: '14px' }}>
          サイトに表示される個人情報を管理できます
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Basic Information */}
        <div style={{
          background: '#2a2a2a',
          borderRadius: '8px',
          padding: '25px',
          marginBottom: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
        }}>
          <h3 style={{ margin: '0 0 20px 0', color: '#fff' }}>基本情報</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: '#ccc' }}>
                名前 *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
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

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: '#ccc' }}>
                肩書き・職業
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="Videographer / Video Director"
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
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>
              自己紹介・経歴
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({...formData, bio: e.target.value})}
              rows={4}
              placeholder="あなたの経歴や制作に対する想いを記載してください"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: '#ccc' }}>
                メールアドレス
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
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

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: '#ccc' }}>
                電話番号
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
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

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: '#ccc' }}>
                所在地
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                placeholder="東京都"
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
          </div>
        </div>

        {/* Skills */}
        <div style={{
          background: '#2a2a2a',
          borderRadius: '8px',
          padding: '25px',
          marginBottom: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
        }}>
          <h3 style={{ margin: '0 0 20px 0', color: '#fff' }}>スキル</h3>
          
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              placeholder="新しいスキルを入力"
              style={{
                flex: 1,
                padding: '8px 12px',
                background: '#3a3a3a',
                color: '#fff',
                border: '1px solid #555',
                borderRadius: '4px'
              }}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
            />
            <button
              type="button"
              onClick={addSkill}
              style={{
                padding: '8px 16px',
                background: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = '#2563eb';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = '#3b82f6';
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
                  background: '#f0f0f0',
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
                    cursor: 'pointer',
                    fontSize: '16px',
                    color: '#666'
                  }}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Services */}
        <div style={{
          background: '#2a2a2a',
          borderRadius: '8px',
          padding: '25px',
          marginBottom: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
        }}>
          <h3 style={{ margin: '0 0 20px 0', color: '#fff' }}>提供サービス</h3>
          
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <input
              type="text"
              value={serviceInput}
              onChange={(e) => setServiceInput(e.target.value)}
              placeholder="提供サービスを入力"
              style={{
                flex: 1,
                padding: '8px 12px',
                background: '#3a3a3a',
                color: '#fff',
                border: '1px solid #555',
                borderRadius: '4px'
              }}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addService())}
            />
            <button
              type="button"
              onClick={addService}
              style={{
                padding: '8px 16px',
                background: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = '#2563eb';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = '#3b82f6';
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
                  background: '#e8f5e8',
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
                    cursor: 'pointer',
                    fontSize: '16px',
                    color: '#666'
                  }}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Social Links */}
        <div style={{
          background: '#2a2a2a',
          borderRadius: '8px',
          padding: '25px',
          marginBottom: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
        }}>
          <h3 style={{ margin: '0 0 20px 0', color: '#fff' }}>SNS・ウェブサイト</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: '#ccc' }}>
                ウェブサイト
              </label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => setFormData({...formData, website: e.target.value})}
                placeholder="https://example.com"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: '#ccc' }}>
                YouTube
              </label>
              <input
                type="url"
                value={formData.social_links.youtube}
                onChange={(e) => setFormData({
                  ...formData, 
                  social_links: {...formData.social_links, youtube: e.target.value}
                })}
                placeholder="https://youtube.com/@username"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: '#ccc' }}>
                Instagram
              </label>
              <input
                type="url"
                value={formData.social_links.instagram}
                onChange={(e) => setFormData({
                  ...formData, 
                  social_links: {...formData.social_links, instagram: e.target.value}
                })}
                placeholder="https://instagram.com/username"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: '#ccc' }}>
                Vimeo
              </label>
              <input
                type="url"
                value={formData.social_links.vimeo}
                onChange={(e) => setFormData({
                  ...formData, 
                  social_links: {...formData.social_links, vimeo: e.target.value}
                })}
                placeholder="https://vimeo.com/username"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: '#ccc' }}>
                LinkedIn
              </label>
              <input
                type="url"
                value={formData.social_links.linkedin}
                onChange={(e) => setFormData({
                  ...formData, 
                  social_links: {...formData.social_links, linkedin: e.target.value}
                })}
                placeholder="https://linkedin.com/in/username"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div style={{ textAlign: 'center' }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '15px 40px',
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
            onMouseOver={(e) => {
              if (!loading) e.currentTarget.style.background = '#2563eb';
            }}
            onMouseOut={(e) => {
              if (!loading) e.currentTarget.style.background = '#3b82f6';
            }}
          >
            {loading ? '保存中...' : 'プロフィールを保存'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProfileManager;