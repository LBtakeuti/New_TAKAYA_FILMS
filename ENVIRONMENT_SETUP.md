# 環境変数設定ガイド

## 必須の環境変数

### 1. Supabase設定
- [ ] `NEXT_PUBLIC_SUPABASE_URL` - SupabaseプロジェクトのURL
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabaseの匿名キー

### 2. 認証設定
- [ ] `JWT_SECRET` - JWT認証用の秘密鍵（生成コマンド: `node generate-jwt-secret.js`）

### 3. オプション設定
- [ ] `SLACK_WEBHOOK_URL` - お問い合わせフォームの通知用（設定しない場合は動作します）

## 設定手順

### ローカル開発環境
1. `.env.local` ファイルを作成
2. 上記の環境変数を設定
3. `npm run dev` で開発サーバーを起動

### Vercelデプロイ
1. Vercelダッシュボードにログイン
2. プロジェクトのSettings → Environment Variables
3. 各環境変数を追加
4. デプロイを実行

## 管理画面アクセス情報
- URL: `/admin/login`
- Username: `admin`
- Password: `takaya2024`

## テスト方法
1. 開発サーバーを起動: `npm run dev`
2. http://localhost:3000 にアクセス
3. 管理画面: http://localhost:3000/admin/login

## トラブルシューティング
- Supabaseエラー: URL/KEYが正しいか確認
- 認証エラー: JWT_SECRETが設定されているか確認
- Slackエラー: SLACK_WEBHOOK_URLを確認（オプション）