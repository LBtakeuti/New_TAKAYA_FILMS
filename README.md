# 🎬 TAKAYA FILMS Portfolio

映像クリエイター TAKAYA のポートフォリオサイト + 管理システム

## 🚀 デプロイ情報

- **本番サイト**: https://your-project.vercel.app (デプロイ後に更新)
- **管理画面**: https://your-project.vercel.app/admin
- **技術スタック**: React + Supabase + Vercel + Slack
- **初期ログイン**: admin / admin123

## 技術構成

### フロントエンド
- React.js + TypeScript
- Tailwind CSS
- React Router DOM
- Axios

### バックエンド
- Node.js + Express.js
- SQLite
- JWT認証
- Multer (ファイルアップロード)
- bcryptjs (パスワードハッシュ化)

## 開発環境セットアップ

1. プロジェクトのクローン
```bash
git clone https://github.com/LBtakeuti/New_TAKAYA_FILMS.git
cd New_TAKAYA_FILMS
```

2. 依存関係のインストール
```bash
npm install
cd frontend && npm install
cd ../backend && npm install
```

3. 環境変数の設定
```bash
# backend/.env ファイルを作成し、以下を設定
PORT=5000
JWT_SECRET=your_jwt_secret_key
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

4. 開発サーバーの起動
```bash
# プロジェクトルートから実行（フロントエンド・バックエンド同時起動）
npm run dev
```

## 利用可能なスクリプト

- `npm run dev` - フロントエンドとバックエンドを同時起動
- `npm run dev:frontend` - フロントエンドのみ起動
- `npm run dev:backend` - バックエンドのみ起動
- `npm run build` - フロントエンドのビルド

## データベース構造

### Tables
- `users` - 管理者認証用
- `videos` - 動画情報管理
- `career` - 経歴情報
- `profile` - プロフィール情報

## 機能概要

### フロントエンド
- ポートフォリオ表示
- 動画プレイヤー
- レスポンシブデザイン
- 管理画面（認証必要）

### バックエンド
- JWT認証システム
- RESTful API
- ファイルアップロード機能
- データベース管理

## 作成者

TAKAYA FILMS