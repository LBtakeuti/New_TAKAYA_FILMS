import React, { useState } from 'react';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      const response = await fetch('http://localhost:5001/api/contact/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus({
          type: 'success',
          message: data.message || 'お問い合わせを送信しました。ご連絡ありがとうございます。'
        });
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setSubmitStatus({
          type: 'error',
          message: data.error || '送信に失敗しました。'
        });
      }
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: 'ネットワークエラーが発生しました。しばらく時間をおいて再度お試しください。'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '15px 20px',
    border: '1px solid rgba(0, 0, 0, 0.15)',
    borderRadius: '8px',
    fontSize: '0.95rem',
    fontFamily: 'inherit',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    transition: 'all 0.3s ease',
    outline: 'none',
    boxSizing: 'border-box'
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '500',
    color: '#333',
    fontSize: '0.9rem',
    letterSpacing: '0.02em',
    textAlign: 'left'
  };

  return (
    <form onSubmit={handleSubmit} style={{ textAlign: 'left', maxWidth: '500px', margin: '0 auto' }}>
      {/* 名前 */}
      <div style={{ marginBottom: '25px' }}>
        <label style={labelStyle}>
          お名前 <span style={{ color: '#e74c3c' }}>*</span>
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          style={inputStyle}
          onFocus={(e) => {
            e.target.style.borderColor = '#000';
            e.target.style.boxShadow = '0 0 0 2px rgba(0, 0, 0, 0.1)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'rgba(0, 0, 0, 0.15)';
            e.target.style.boxShadow = 'none';
          }}
        />
      </div>

      {/* メールアドレス */}
      <div style={{ marginBottom: '25px' }}>
        <label style={labelStyle}>
          メールアドレス <span style={{ color: '#e74c3c' }}>*</span>
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          style={inputStyle}
          onFocus={(e) => {
            e.target.style.borderColor = '#000';
            e.target.style.boxShadow = '0 0 0 2px rgba(0, 0, 0, 0.1)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'rgba(0, 0, 0, 0.15)';
            e.target.style.boxShadow = 'none';
          }}
        />
      </div>

      {/* 件名 */}
      <div style={{ marginBottom: '25px' }}>
        <label style={labelStyle}>
          件名 <span style={{ color: '#e74c3c' }}>*</span>
        </label>
        <input
          type="text"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          required
          style={inputStyle}
          onFocus={(e) => {
            e.target.style.borderColor = '#000';
            e.target.style.boxShadow = '0 0 0 2px rgba(0, 0, 0, 0.1)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'rgba(0, 0, 0, 0.15)';
            e.target.style.boxShadow = 'none';
          }}
        />
      </div>

      {/* メッセージ */}
      <div style={{ marginBottom: '30px' }}>
        <label style={labelStyle}>
          メッセージ <span style={{ color: '#e74c3c' }}>*</span>
        </label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={6}
          style={{
            ...inputStyle,
            resize: 'vertical',
            minHeight: '120px',
            fontFamily: 'inherit',
            lineHeight: '1.6'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#000';
            e.target.style.boxShadow = '0 0 0 2px rgba(0, 0, 0, 0.1)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'rgba(0, 0, 0, 0.15)';
            e.target.style.boxShadow = 'none';
          }}
        />
      </div>

      {/* 送信状況メッセージ */}
      {submitStatus.type && (
        <div
          style={{
            padding: '15px 20px',
            borderRadius: '8px',
            marginBottom: '20px',
            backgroundColor: submitStatus.type === 'success' ? 'rgba(46, 204, 113, 0.1)' : 'rgba(231, 76, 60, 0.1)',
            border: `1px solid ${submitStatus.type === 'success' ? 'rgba(46, 204, 113, 0.3)' : 'rgba(231, 76, 60, 0.3)'}`,
            color: submitStatus.type === 'success' ? '#27ae60' : '#e74c3c',
            fontSize: '0.9rem',
            textAlign: 'center'
          }}
        >
          {submitStatus.message}
        </div>
      )}

      {/* 送信ボタン */}
      <div style={{ textAlign: 'center' }}>
        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            background: isSubmitting ? '#999' : '#000',
            color: '#fff',
            border: 'none',
            padding: '15px 40px',
            borderRadius: '8px',
            fontSize: '0.95rem',
            fontWeight: '500',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            minWidth: '160px',
            fontFamily: 'inherit',
            letterSpacing: '0.02em'
          }}
          onMouseEnter={(e) => {
            if (!isSubmitting) {
              e.currentTarget.style.background = '#333';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isSubmitting) {
              e.currentTarget.style.background = '#000';
              e.currentTarget.style.transform = 'translateY(0)';
            }
          }}
        >
          {isSubmitting ? '送信中...' : 'お問い合わせを送信'}
        </button>
      </div>

      {/* 注意書き */}
      <div style={{
        marginTop: '20px',
        fontSize: '0.8rem',
        color: 'rgba(0, 0, 0, 0.6)',
        textAlign: 'center',
        lineHeight: '1.6'
      }}>
        送信いただいた内容は、2〜3営業日以内にご返信いたします。<br />
        お急ぎの場合は、直接お電話にてお問い合わせください。
      </div>
    </form>
  );
};

export default ContactForm;