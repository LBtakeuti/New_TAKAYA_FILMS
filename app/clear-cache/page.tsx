'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ClearCachePage() {
  const router = useRouter();

  useEffect(() => {
    // LocalStorageをクリア
    localStorage.clear();
    
    // SessionStorageをクリア
    sessionStorage.clear();
    
    // Cookieをクリア（可能な範囲で）
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
    });
    
    // Service Workerを解除
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => {
          registration.unregister();
        });
      });
    }
    
    // キャッシュをクリア
    if ('caches' in window) {
      caches.keys().then((names) => {
        names.forEach((name) => {
          caches.delete(name);
        });
      });
    }
    
    alert('キャッシュをクリアしました。ログイン画面に移動します。');
    
    // ログイン画面に移動
    setTimeout(() => {
      router.push('/admin/login');
    }, 1000);
  }, [router]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#f5f5f5'
    }}>
      <h1>キャッシュをクリアしています...</h1>
      <p>しばらくお待ちください。</p>
    </div>
  );
}