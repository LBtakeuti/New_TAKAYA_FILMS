# Supabase セットアップガイド

## 1. Supabaseプロジェクトの作成

1. [https://app.supabase.com](https://app.supabase.com) にアクセス
2. 「New project」をクリック
3. プロジェクト名: `takaya-films`
4. データベースパスワードを設定（安全な場所に保存）
5. リージョン: `Northeast Asia (Tokyo)`を選択
6. 「Create new project」をクリック

## 2. データベースのセットアップ

1. プロジェクトダッシュボードで「SQL Editor」をクリック
2. `supabase-setup.sql`の内容をコピー
3. SQL Editorに貼り付けて「Run」をクリック
4. 成功メッセージを確認

## 3. 環境変数の取得

1. プロジェクトダッシュボードで「Settings」→「API」をクリック
2. 以下の値をコピー：
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 4. Vercelでの環境変数設定

1. [Vercel Dashboard](https://vercel.com/dashboard) にアクセス
2. プロジェクト「new-takaya-films」をクリック
3. 「Settings」→「Environment Variables」
4. 以下を追加：

```
Key: SUPABASE_URL
Value: [上記でコピーしたProject URL]

Key: SUPABASE_ANON_KEY
Value: [上記でコピーしたanon public key]

Key: JWT_SECRET
Value: [安全なランダム文字列]

Key: NODE_ENV
Value: production
```

5. すべて追加したら、最新のデプロイメントを再デプロイ

## 5. 動作確認

1. 管理画面にアクセス: `https://[your-domain]/admin`
2. ログイン: admin / admin123
3. プロフィールを編集して保存
4. Supabaseダッシュボードの「Table Editor」でデータが保存されていることを確認

## トラブルシューティング

### エラー: "Supabase environment variables are not set"
- Vercelの環境変数が正しく設定されているか確認
- デプロイメントを再実行

### エラー: "relation does not exist"
- SQL Editorで`supabase-setup.sql`を再実行
- テーブルが作成されているか確認

### データが保存されない
- Supabaseの「Authentication」→「Policies」でRLSポリシーを確認
- anon/authenticatedユーザーに適切な権限があるか確認