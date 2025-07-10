// 環境に応じたロギングユーティリティ
const isDevelopment = process.env.NODE_ENV === 'development';
const isClient = typeof window !== 'undefined';

export const logger = {
  log: (...args: any[]) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },
  
  error: (...args: any[]) => {
    // エラーは本番環境でも出力（ただし詳細度を調整）
    if (isDevelopment) {
      console.error(...args);
    } else {
      // 本番環境では最小限の情報のみ
      console.error(args[0] instanceof Error ? args[0].message : args[0]);
    }
  },
  
  warn: (...args: any[]) => {
    if (isDevelopment) {
      console.warn(...args);
    }
  },
  
  info: (...args: any[]) => {
    if (isDevelopment) {
      console.info(...args);
    }
  },
  
  debug: (...args: any[]) => {
    if (isDevelopment) {
      console.debug(...args);
    }
  },
  
  // グループ化されたログ
  group: (label: string, fn: () => void) => {
    if (isDevelopment) {
      console.group(label);
      fn();
      console.groupEnd();
    }
  },
  
  // パフォーマンス計測
  time: (label: string) => {
    if (isDevelopment) {
      console.time(label);
    }
  },
  
  timeEnd: (label: string) => {
    if (isDevelopment) {
      console.timeEnd(label);
    }
  }
};

// 開発環境でのみ実行される関数
export const devOnly = (fn: () => void) => {
  if (isDevelopment) {
    fn();
  }
};