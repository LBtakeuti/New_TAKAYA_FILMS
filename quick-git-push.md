# 🚀 Gitプッシュ手順（コピー＆ペースト用）

以下のコマンドをターミナルにコピー＆ペーストしてください：

```bash
cd /Users/keitakeuchi/New_TAKAYA_FILMS && git add . && git commit -m "Fix Vercel build configuration and convert to Supabase database with Slack notifications" && git push origin main
```

## 個別コマンド（1つずつ実行したい場合）

```bash
cd /Users/keitakeuchi/New_TAKAYA_FILMS
```

```bash
git add .
```

```bash
git commit -m "Fix Vercel build configuration and convert to Supabase database with Slack notifications"
```

```bash
git push origin main
```

## プッシュ後の確認

1. **Vercel**: https://vercel.com でビルド状況を確認
2. **GitHub**: https://github.com/LBtakeuti/New_TAKAYA_FILMS で更新を確認

## トラブルシューティング

### "fatal: not a git repository"エラーの場合
```bash
cd /Users/keitakeuchi/New_TAKAYA_FILMS
git init
git remote add origin https://github.com/LBtakeuti/New_TAKAYA_FILMS.git
```

### 認証エラーの場合
GitHubのユーザー名とパスワード（またはPersonal Access Token）を入力