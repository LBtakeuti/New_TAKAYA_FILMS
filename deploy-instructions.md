# TAKAYA FILMS - Vercel デプロイ手順

## 1. Supabase環境変数の確認

Supabaseダッシュボードから以下の情報を取得してください：

- **SUPABASE_URL**: プロジェクトURL (例: https://xxxxx.supabase.co)
- **SUPABASE_ANON_KEY**: アノニマスキー (公開用)

## 2. Vercelデプロイ

### コマンドラインからデプロイ:

```bash
# プロジェクトルートディレクトリで実行
npx vercel

# 初回設定で以下を選択:
# - Set up and deploy "~/New_TAKAYA_FILMS"? [Y/n] → Y
# - Which scope do you want to deploy to? → 自分のアカウント
# - Link to existing project? [y/N] → N
# - What's your project's name? → takaya-films
# - In which directory is your code located? → ./
```

### 環境変数設定:

```bash
# 環境変数を一つずつ設定
npx vercel env add SUPABASE_URL
npx vercel env add SUPABASE_ANON_KEY
npx vercel env add JWT_SECRET
npx vercel env add SLACK_WEBHOOK_URL
npx vercel env add NODE_ENV
```

または Vercelダッシュボードで設定:
1. プロジェクト → Settings → Environment Variables
2. 以下の変数を追加:

```
SUPABASE_URL=your-supabase-project-url
SUPABASE_ANON_KEY=your-supabase-anon-key
JWT_SECRET=your-strong-secret-key
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK
NODE_ENV=production
```

## 3. 本番デプロイ

```bash
# 本番環境にデプロイ
npx vercel --prod
```

## 4. デプロイ後の確認

1. **フロントエンド**: https://your-project.vercel.app
2. **API**: https://your-project.vercel.app/api/test
3. **管理画面**: https://your-project.vercel.app/admin

## 5. 初期データ設定

デプロイ後、管理画面にログインして初期設定を行ってください：

- **Username**: admin
- **Password**: admin123

その後、プロフィール情報と動画コンテンツを追加してください。

## トラブルシューティング

### よくあるエラー:
1. **Supabase接続エラー**: 環境変数が正しく設定されているか確認
2. **Gmail送信エラー**: アプリパスワードが正しく設定されているか確認
3. **ビルドエラー**: `npm run build`でローカルビルドが成功するか確認