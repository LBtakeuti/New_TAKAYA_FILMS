# 🚀 デプロイ前チェックリスト

## ✅ 必要な環境変数

以下の環境変数をVercelで設定する必要があります：

### 1. Supabase関連
- [ ] `SUPABASE_URL` - SupabaseプロジェクトのURL
- [ ] `SUPABASE_ANON_KEY` - Supabaseのアノニマスキー

### 2. 認証関連
- [ ] `JWT_SECRET` - JWT署名用の秘密鍵（強力なランダム文字列）

### 3. Slack通知関連
- [ ] `SLACK_WEBHOOK_URL` - Slack Incoming WebhookのURL

### 4. 環境設定
- [ ] `NODE_ENV` - "production"に設定

## 📝 Supabaseで必要な設定

1. **データベース作成**: `supabase-schema.sql`を実行
2. **RLS（Row Level Security）**: 必要に応じて設定
3. **初期データ**: admin ユーザー作成済み（username: admin, password: admin123）

## 🔍 デプロイ前の確認事項

- [ ] ローカルでビルドが成功するか確認
- [ ] 不要なconsole.logを削除
- [ ] 環境変数の参照箇所を確認
- [ ] .gitignoreに機密情報が含まれていないか確認

## 🎯 デプロイ後の確認

1. **本番サイト動作確認**
   - [ ] トップページ表示
   - [ ] 動画一覧表示
   - [ ] コンタクトフォーム送信

2. **管理画面動作確認**
   - [ ] ログイン機能
   - [ ] 動画管理CRUD
   - [ ] プロフィール編集

3. **Slack通知確認**
   - [ ] コンタクトフォームからテスト送信
   - [ ] Slackチャンネルに通知が届くか確認

## 🚨 トラブルシューティング

### よくあるエラー:
1. **500 Internal Server Error**
   - 環境変数が正しく設定されているか確認
   - Supabaseの接続情報を確認

2. **CORS エラー**
   - Vercelのドメインがbackend/server.jsのCORS設定に含まれているか確認

3. **データベース接続エラー**
   - SupabaseのURLとキーが正しいか確認
   - データベーススキーマが作成されているか確認