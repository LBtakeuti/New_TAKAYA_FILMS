'use client';

import React from 'react';
import { forceCacheClear } from '@/utils/cache';

export default function CacheClearButton() {
  const handleCacheClear = () => {
    if (confirm('キャッシュをクリアしてページを再読み込みしますか？')) {
      forceCacheClear();
    }
  };

  return (
    <button
      onClick={handleCacheClear}
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        background: '#ff0000',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        padding: '10px 20px',
        fontSize: '14px',
        cursor: 'pointer',
        zIndex: 9999,
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
      }}
    >
      キャッシュクリア
    </button>
  );
}