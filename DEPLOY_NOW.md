# 🚀 今すぐデプロイ！

## ✅ Supabase情報（受け取りました）
- **URL**: `https://wnwicjiqedtwxvhupcgh.supabase.co`
- **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indud2ljamlxZWR0d3h2aHVwY2doIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyODk5MjgsImV4cCI6MjA2Njg2NTkyOH0.U-QqKq712Kp6HTrERSsUD_zGMfGq_Q4IpuwBzNhWnvk`

## 📋 残りの手順

### 1. JWT Secret生成
```bash
node jwt-secret-generator.js
```

### 2. Vercelプロジェクト作成（まだの場合）
```bash
npx vercel
```

### 3. 環境変数設定

#### 方法1: スクリプトを使用
```bash
chmod +x vercel-env-setup.sh
./vercel-env-setup.sh
```

#### 方法2: 手動で設定
```bash
# Supabase URL
echo "https://wnwicjiqedtwxvhupcgh.supabase.co" | npx vercel env add SUPABASE_URL production

# Supabase Anon Key
echo "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indud2ljamlxZWR0d3h2aHVwY2doIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyODk5MjgsImV4cCI6MjA2Njg2NTkyOH0.U-QqKq712Kp6HTrERSsUD_zGMfGq_Q4IpuwBzNhWnvk" | npx vercel env add SUPABASE_ANON_KEY production

# NODE_ENV
echo "production" | npx vercel env add NODE_ENV production

# JWT_SECRET (jwt-secret-generator.jsで生成した値を使用)
npx vercel env add JWT_SECRET production

# SLACK_WEBHOOK_URL (Slackから取得、なければ後で設定可能)
npx vercel env add SLACK_WEBHOOK_URL production
```

### 4. Supabaseデータベース設定
1. https://app.supabase.com でプロジェクトを開く
2. SQL Editor で `supabase-schema.sql` の内容を実行

### 5. 本番デプロイ
```bash
npx vercel --prod
```

## 🎯 デプロイ後の確認

デプロイが完了したら、以下のURLでアクセス：
- メインサイト: `https://your-project.vercel.app`
- 管理画面: `https://your-project.vercel.app/admin`
- APIテスト: `https://your-project.vercel.app/api/test`

## 📝 初期ログイン情報
- Username: `admin`
- Password: `admin123`

## ⚠️ 重要
- JWT_SECRETは必ず強力なランダム文字列を使用
- Slack通知が不要な場合は、SLACK_WEBHOOK_URLは後で設定可能
- デプロイ後、管理画面でパスワードを変更することを推奨