# Supabase データベース設定ガイド

## 🎯 設計方針

1. **シンプル**: 必要最小限のカラムのみ
2. **柔軟性**: JSONBで拡張可能な構造
3. **パフォーマンス**: 適切なインデックス設定
4. **セキュリティ**: Row Level Security (RLS) 実装

## 📊 テーブル構造

### 1. profile テーブル
- **目的**: サイトオーナーのプロフィール情報（1レコードのみ）
- **特徴**: 
  - UUIDを使用（セキュリティ向上）
  - 連絡先とSNSリンクはJSONBで柔軟に管理
  - 1レコード制限あり

## 🚀 セットアップ手順

### 1. Supabaseプロジェクトの作成
```bash
1. https://supabase.com にアクセス
2. 「Start your project」をクリック
3. GitHubまたはEmailでサインアップ
4. 新規プロジェクトを作成
```

### 2. データベースの初期化
```bash
1. Supabaseダッシュボードで「SQL Editor」を開く
2. schema.sql の内容をコピー＆ペースト
3. 「RUN」をクリックして実行
```

### 3. 環境変数の取得
```bash
1. Settings → API
2. 以下をコピー：
   - Project URL → NEXT_PUBLIC_SUPABASE_URL
   - anon public → NEXT_PUBLIC_SUPABASE_ANON_KEY
```

## 🔧 API使用例

### プロフィール取得
```javascript
const { data, error } = await supabase
  .from('profile')
  .select('*')
  .single();
```


## 📝 メンテナンス

### バックアップ
Supabaseは自動バックアップを提供していますが、重要なデータは定期的にエクスポートすることを推奨します。

### パフォーマンス監視
- Supabaseダッシュボードの「Database」→「Query Performance」で確認
- 必要に応じてインデックスを追加

## 🆘 トラブルシューティング

### RLSエラーが発生する場合
```sql
-- RLSを一時的に無効化（開発時のみ）
ALTER TABLE profile DISABLE ROW LEVEL SECURITY;
```

### データが取得できない場合
1. 環境変数が正しく設定されているか確認
2. RLSポリシーを確認
3. Supabaseダッシュボードでデータの存在を確認