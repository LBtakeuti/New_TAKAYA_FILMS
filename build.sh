#!/bin/bash
# Vercel用ビルドスクリプト

echo "🚀 TAKAYA FILMS - カスタムビルド開始"

# フロントエンドの依存関係インストール
echo "📦 フロントエンド依存関係インストール中..."
cd frontend
npm install

# フロントエンドビルド
echo "🔨 フロントエンドビルド中..."
npm run build

echo "✅ ビルド完了！"