'use client';

import React, { useState, useEffect } from 'react';

interface Career {
  id: number;
  company_name: string;
  position: string;
  description: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
  location: string;
  achievements: string;
  sort_order: number;
  created_at: string;
}

interface CareerManagerProps {
  token: string;
}

function CareerManager({ token }: CareerManagerProps) {
  const [careers, setCareers] = useState<Career[]>([]);
  const [editingCareer, setEditingCareer] = useState<Career | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    company_name: '',
    position: '',
    description: '',
    start_date: '',
    end_date: '',
    is_current: false,
    location: '',
    achievements: '',
    sort_order: 0
  });

  useEffect(() => {
    fetchCareers();
  }, []);

  const fetchCareers = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/career');
      const data = await response.json();
      setCareers(data);
    } catch (error) {
      console.error('Error fetching careers:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editingCareer 
        ? `http://localhost:5001/api/career/${editingCareer.id}`
        : 'http://localhost:5001/api/career';
      
      const method = editingCareer ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        fetchCareers();
        resetForm();
        setIsModalOpen(false);
      } else {
        alert('エラーが発生しました');
      }
    } catch (error) {
      alert('エラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (career: Career) => {
    setEditingCareer(career);
    setFormData({
      company_name: career.company_name,
      position: career.position,
      description: career.description,
      start_date: career.start_date,
      end_date: career.end_date || '',
      is_current: career.is_current,
      location: career.location || '',
      achievements: career.achievements || '',
      sort_order: career.sort_order
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('この経歴を削除しますか？')) return;

    try {
      const response = await fetch(`http://localhost:5001/api/career/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchCareers();
      }
    } catch (error) {
      alert('削除エラーが発生しました');
    }
  };

  const resetForm = () => {
    setFormData({
      company_name: '',
      position: '',
      description: '',
      start_date: '',
      end_date: '',
      is_current: false,
      location: '',
      achievements: '',
      sort_order: 0
    });
    setEditingCareer(null);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long'
    });
  };

  return (
    <div style={{ padding: '30px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 style={{ margin: 0, color: '#333' }}>経歴管理</h2>
        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          style={{
            background: '#000',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          + 新しい経歴を追加
        </button>
      </div>

      {/* Careers List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {careers.map(career => (
          <div key={career.id} style={{
            background: 'white',
            borderRadius: '8px',
            padding: '25px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            border: career.is_current ? '2px solid #4caf50' : '1px solid #e0e0e0'
          }}>
            {/* Career Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: '0 0 5px 0', fontSize: '1.2rem', color: '#333' }}>
                  {career.position}
                  {career.is_current && (
                    <span style={{
                      marginLeft: '10px',
                      background: '#4caf50',
                      color: 'white',
                      padding: '3px 8px',
                      borderRadius: '12px',
                      fontSize: '0.7rem'
                    }}>
                      現在
                    </span>
                  )}
                </h3>
                <p style={{ margin: '0 0 5px 0', fontSize: '1rem', color: '#666', fontWeight: '500' }}>
                  {career.company_name}
                </p>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#888' }}>
                  {formatDate(career.start_date)} - {career.is_current ? '現在' : formatDate(career.end_date)}
                  {career.location && ` • ${career.location}`}
                </p>
              </div>
              
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => handleEdit(career)}
                  style={{
                    background: '#f8f9fa',
                    border: '1px solid #dee2e6',
                    padding: '8px 12px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.9rem'
                  }}
                >
                  編集
                </button>
                <button
                  onClick={() => handleDelete(career.id)}
                  style={{
                    background: '#dc3545',
                    color: 'white',
                    border: 'none',
                    padding: '8px 12px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.9rem'
                  }}
                >
                  削除
                </button>
              </div>
            </div>

            {/* Career Description */}
            {career.description && (
              <p style={{ 
                margin: '0 0 15px 0', 
                color: '#555', 
                lineHeight: '1.6',
                fontSize: '0.95rem'
              }}>
                {career.description}
              </p>
            )}

            {/* Achievements */}
            {career.achievements && (
              <div style={{ 
                background: '#f8f9fa', 
                padding: '15px', 
                borderRadius: '6px',
                marginTop: '15px'
              }}>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '0.9rem', color: '#666' }}>主な実績・成果</h4>
                <p style={{ margin: 0, color: '#555', fontSize: '0.9rem', lineHeight: '1.5' }}>
                  {career.achievements}
                </p>
              </div>
            )}
          </div>
        ))}

        {careers.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '60px',
            color: '#666',
            background: 'white',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            経歴がまだ登録されていません
          </div>
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
            background: 'white',
            borderRadius: '8px',
            padding: '30px',
            width: '90%',
            maxWidth: '600px',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <h3 style={{ margin: '0 0 25px 0' }}>
              {editingCareer ? '経歴を編集' : '新しい経歴を追加'}
            </h3>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>
                    会社名 *
                  </label>
                  <input
                    type="text"
                    value={formData.company_name}
                    onChange={(e) => setFormData({...formData, company_name: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      boxSizing: 'border-box'
                    }}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>
                    役職・職種 *
                  </label>
                  <input
                    type="text"
                    value={formData.position}
                    onChange={(e) => setFormData({...formData, position: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      boxSizing: 'border-box'
                    }}
                    required
                  />
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>
                  業務内容・説明
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>
                    開始日 *
                  </label>
                  <input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '4px'
                    }}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>
                    終了日
                  </label>
                  <input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                    disabled={formData.is_current}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      background: formData.is_current ? '#f5f5f5' : 'white'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>
                    勤務地
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    placeholder="東京都"
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="checkbox"
                    checked={formData.is_current}
                    onChange={(e) => {
                      setFormData({
                        ...formData, 
                        is_current: e.target.checked,
                        end_date: e.target.checked ? '' : formData.end_date
                      });
                    }}
                  />
                  <span style={{ fontSize: '14px' }}>現在の職場</span>
                </label>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>
                  主な実績・成果
                </label>
                <textarea
                  value={formData.achievements}
                  onChange={(e) => setFormData({...formData, achievements: e.target.value})}
                  rows={3}
                  placeholder="具体的な実績や成果があれば記載してください"
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    padding: '10px 20px',
                    border: '1px solid #ddd',
                    background: 'white',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    padding: '10px 20px',
                    background: '#000',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: loading ? 'not-allowed' : 'pointer'
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

export default CareerManager;