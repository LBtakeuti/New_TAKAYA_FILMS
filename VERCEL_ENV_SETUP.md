# Vercel環境変数設定ガイド

## 必要な環境変数

Vercelダッシュボードで以下の環境変数を設定してください：

### 1. SUPABASE_URL
- Supabaseプロジェクトの URL
- 例: `https://xxxxx.supabase.co`
- Supabaseダッシュボード > Settings > API で確認

### 2. SUPABASE_ANON_KEY
- Supabaseの匿名キー（anon/public）
- Supabaseダッシュボード > Settings > API で確認

### 3. JWT_SECRET
- JWT認証用の秘密鍵
- 推奨: ランダムな32文字以上の文字列
- 生成例: `openssl rand -base64 32`

### 4. SLACK_WEBHOOK_URL (オプション)
- お問い合わせ通知用のSlack Webhook URL
- Slack App > Incoming Webhooks で作成

### 5. NODE_ENV
- 値: `production`

## 設定方法

1. Vercelダッシュボードにアクセス
2. プロジェクト「new-takaya-films」を選択
3. Settings > Environment Variables に移動
4. 上記の環境変数を追加
5. 「Save」をクリック

## 重要な注意事項

- 環境変数を追加/変更した後は、再デプロイが必要です
- 本番環境（Production）に設定してください
- SUPABASE_URL と SUPABASE_ANON_KEY が設定されていない場合、モックストレージが使用されます

## デバッグ方法

管理画面でエラーが発生する場合：
1. ブラウザの開発者ツールでコンソールエラーを確認
2. ネットワークタブでAPIレスポンスを確認
3. Vercelのログで詳細なエラーを確認