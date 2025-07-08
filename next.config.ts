import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '500mb',
    },
  },
  // キャッシュを無効化してビルドごとに新しいIDを生成
  generateBuildId: async () => {
    return 'build-' + Date.now()
  },
  // ヘッダーの設定でキャッシュを制御
  async headers() {
    return [
      {
        // APIエンドポイントはキャッシュを許可
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=60', // 1分間キャッシュ
          },
        ],
      },
      {
        // その他のページはキャッシュを無効化
        source: '/:path((?!api).*)*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, must-revalidate',
          },
        ],
      },
    ]
  },
};

export default nextConfig;
