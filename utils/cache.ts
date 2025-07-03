export const forceCacheClear = () => {
  // Service Workerのキャッシュをクリア
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({ type: 'CLEAR_CACHE' });
  }

  // ブラウザキャッシュをクリア
  if ('caches' in window) {
    caches.keys().then(names => {
      names.forEach(name => {
        caches.delete(name);
      });
    });
  }

  // 強制リロード
  window.location.reload(true);
};

// ビルドバージョンを管理
export const BUILD_VERSION = '1.0.1';

// APIコールにバージョンを追加
export const addCacheBuster = (url: string): string => {
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}v=${BUILD_VERSION}&t=${Date.now()}`;
};