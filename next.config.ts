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
  // キャッシュを無効化してビルドごとに新しいIDを生成
  generateBuildId: async () => {
    return 'build-' + Date.now()
  },
  // ヘッダーの設定でキャッシュを制御
  async headers() {
    return [
      {
        source: '/:path*',
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
