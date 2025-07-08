# Supabase Storage 設定ガイド

## 動画アップロード機能を有効にするための手順

### 1. Supabaseプロジェクトの作成

1. [Supabase](https://supabase.com)にアクセスしてアカウントを作成
2. 新しいプロジェクトを作成
3. プロジェクトの初期化が完了するまで待機（約2分）

### 2. API認証情報の取得

1. Supabaseダッシュボードにログイン
2. 左側メニューから「Settings」→「API」を選択
3. 以下の情報をコピー：
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### 3. ストレージバケットの作成

1. 左側メニューから「Storage」を選択
2. 「New bucket」をクリック
3. 以下の設定でバケットを作成：

#### videosバケット
- **Name**: `videos`
- **Public bucket**: ✅ ON（チェックを入れる）
- **File size limit**: 100MB以上
- **Allowed MIME types**: 
  ```
  video/mp4
  video/quicktime
  video/x-msvideo
  video/webm
  video/ogg
  ```

4. 「Create bucket」をクリック

### 4. ストレージポリシーの設定

1. 作成した`videos`バケットをクリック
2. 「Policies」タブを選択
3. 「New Policy」をクリック
4. 「For full customization」を選択
5. 以下の設定を入力：

#### アップロードポリシー
- **Policy name**: `Allow public uploads`
- **Policy command**: `INSERT`
- **Target roles**: `anon`（匿名ユーザー）
- **WITH CHECK expression**:
  ```sql
  true
  ```

#### 読み取りポリシー
- **Policy name**: `Allow public read`
- **Policy command**: `SELECT`
- **Target roles**: `anon`（匿名ユーザー）
- **USING expression**:
  ```sql
  true
  ```

### 5. Vercel環境変数の設定

1. [Vercel Dashboard](https://vercel.com)にログイン
2. プロジェクトを選択
3. 「Settings」→「Environment Variables」
4. 以下の環境変数を追加：

| Key | Value | Environment |
|-----|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxxx.supabase.co` | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` | Production, Preview, Development |

5. 「Save」をクリック

### 6. 再デプロイ

1. Vercelダッシュボードで「Deployments」タブを選択
2. 最新のデプロイメントの「...」メニューから「Redeploy」を選択
3. 「Redeploy」をクリック

## トラブルシューティング

### エラー: "ストレージバケットの確認に失敗"
- Supabaseプロジェクトが完全に初期化されているか確認
- API URLとキーが正しく設定されているか確認

### エラー: "アップロード権限エラー"
- バケットがPublicに設定されているか確認
- ストレージポリシーが正しく設定されているか確認

### エラー: "Supabase環境変数が設定されていません"
- Vercelの環境変数が正しく設定されているか確認
- 変数名が正確に`NEXT_PUBLIC_`で始まっているか確認
- 再デプロイを実行したか確認

## ローカル開発環境での設定

1. プロジェクトルートに`.env.local`ファイルを作成
2. 以下の内容を追加：
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```
3. 開発サーバーを再起動

## 注意事項

- 無料プランでは1GBまでのストレージが利用可能
- ファイルサイズ制限は現在100MBに設定
- YouTube URLでの投稿は常に利用可能（Supabase不要）