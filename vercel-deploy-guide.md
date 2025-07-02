# 🚀 Vercel × Supabase デプロイガイド

## 📋 必要な情報

### 1. Supabaseプロジェクト情報
Supabaseダッシュボード (https://app.supabase.com) から取得：

- **Project URL**: Settings → API → Project URL
- **Anon Key**: Settings → API → Project API keys → anon public

### 2. Slack Webhook URL
Slack App設定から取得（slack-setup.md参照）

## 🎯 デプロイ手順

### ステップ1: Vercel CLIでプロジェクト作成

```bash
cd /Users/keitakeuchi/New_TAKAYA_FILMS

# Vercel CLIでデプロイ
npx vercel

# 以下の質問に答える：
# ? Set up and deploy "~/New_TAKAYA_FILMS"? → Yes
# ? Which scope do you want to deploy to? → 自分のアカウント選択
# ? Link to existing project? → No (新規の場合)
# ? What's your project's name? → takaya-films
# ? In which directory is your code located? → ./ (そのままEnter)
# ? Want to modify these settings? → No
```

### ステップ2: 環境変数の設定

Vercelダッシュボード (https://vercel.com) で：

1. プロジェクトを選択
2. Settings → Environment Variables
3. 以下を追加：

| 変数名 | 値 | 環境 |
|--------|-----|------|
| SUPABASE_URL | https://xxxxx.supabase.co | Production |
| SUPABASE_ANON_KEY | eyJhbGc... (長い文字列) | Production |
| JWT_SECRET | ランダムな強力な文字列 | Production |
| SLACK_WEBHOOK_URL | https://hooks.slack.com/... | Production |
| NODE_ENV | production | Production |

### ステップ3: ビルド設定の確認

Vercel Settings → General で：

- **Framework Preset**: Other
- **Build Command**: `cd frontend && npm run build`
- **Output Directory**: `frontend/build`
- **Install Command**: `npm install`

### ステップ4: 本番デプロイ

```bash
# 本番環境にデプロイ
npx vercel --prod
```

## 🔧 Supabaseデータベース設定

1. Supabase SQL Editorで `supabase-schema.sql` を実行
2. 初期データ確認（adminユーザーが作成される）

## ✅ デプロイ後の確認

### 1. サイト動作確認
- メインサイト: https://takaya-films.vercel.app
- 管理画面: https://takaya-films.vercel.app/admin
- APIテスト: https://takaya-films.vercel.app/api/test

### 2. 機能テスト
- [ ] トップページの表示
- [ ] 動画一覧の表示
- [ ] コンタクトフォーム送信 → Slack通知
- [ ] 管理画面ログイン（admin/admin123）
- [ ] 動画の追加・編集・削除

## 🚨 トラブルシューティング

### "Invalid Supabase URL" エラー
→ 環境変数のSUPABASE_URLが正しく設定されているか確認

### "CORS Error"
→ Supabaseダッシュボードで許可するドメインを追加

### Slack通知が届かない
→ Webhook URLが正しいか、curlコマンドでテスト

```bash
curl -X POST -H 'Content-Type: application/json' \
--data '{"text":"Test from Vercel"}' \
YOUR_SLACK_WEBHOOK_URL
```

## 📝 完了チェックリスト

- [ ] Vercelプロジェクト作成完了
- [ ] 環境変数5つ全て設定
- [ ] Supabaseスキーマ実行
- [ ] 本番デプロイ成功
- [ ] 全機能の動作確認
- [ ] デプロイURLをREADMEに記載