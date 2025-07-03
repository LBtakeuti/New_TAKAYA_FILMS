# TAKAYA FILMS - デプロイメント手順

## 🚀 Vercel環境変数設定（重要）

本番環境で管理画面を正常に動作させるために、以下の環境変数を設定してください。

### 必須の環境変数

| 環境変数名 | 値 | 説明 |
|-----------|---|------|
| `JWT_SECRET` | `your-secret-key` | 管理画面の認証トークン生成用 |
| `NEXT_PUBLIC_SUPABASE_URL` | `your_supabase_url_here` | Supabaseを使用する場合のみ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `your_supabase_anon_key_here` | Supabaseを使用する場合のみ |

### 📝 設定手順（詳細）

1. **Vercelダッシュボードにログイン**
   - https://vercel.com/dashboard

2. **プロジェクトを選択**
   - `takaya-films` プロジェクトをクリック

3. **環境変数の設定**
   - 上部メニューから `Settings` をクリック
   - 左側メニューから `Environment Variables` を選択
   - `Add New` ボタンをクリック
   - 各環境変数を追加：
     - Name: `JWT_SECRET`
     - Value: `your-secret-key`
     - Environment: `Production`, `Preview`, `Development` すべてにチェック
     - `Save` をクリック

4. **再デプロイ**
   - `Deployments` タブに移動
   - 最新のデプロイメントの「...」メニューから `Redeploy` を選択
   - `Redeploy` ボタンをクリック

### 🔍 動作確認

1. **管理画面アクセス**
   - https://takaya-films.vercel.app/admin/login

2. **ログイン情報**
   - Username: `admin`
   - Password: `takaya2024`

### ⚠️ 注意事項

- **環境変数を追加・変更した後は必ず再デプロイが必要です**
- Supabaseを使用しない場合、データは永続化されません（モックストレージ使用）
- 本番環境では`JWT_SECRET`を安全なランダム文字列に変更することを推奨します

### 🛠️ トラブルシューティング

**管理画面にログインできない場合：**
1. 環境変数が正しく設定されているか確認
2. 再デプロイが完了しているか確認
3. ブラウザのキャッシュをクリア
4. コンソールエラーを確認（F12キー）

**データが保存されない場合：**
- Supabase環境変数が設定されていない場合、データは一時的にしか保存されません
- Supabaseを設定するか、他のデータベースソリューションの実装が必要です