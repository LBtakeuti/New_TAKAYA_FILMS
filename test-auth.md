# 認証テスト手順

## 403エラーの修正内容

1. **api.ts**: 
   - ローカルホストでも常にAuthorizationヘッダーを送信するように修正
   - デバッグログを追加して、リクエストの詳細を確認できるように

2. **profile/route.ts**:
   - より確実なローカルホスト判定（host, origin, refererをすべてチェック）
   - デバッグログを追加して、認証プロセスを追跡できるように

3. **.env.local**:
   - JWT_SECRETを安全なランダム値に更新

## テスト手順

1. 開発サーバーを再起動
```bash
# 既存のサーバーを停止（Ctrl+C）
# 再起動
npm run dev
```

2. ブラウザの開発者ツールを開く（F12）

3. 管理画面にログイン
   - http://localhost:3000/admin/login
   - Username: admin
   - Password: admin123

4. プロフィール編集画面でデータを保存

5. ネットワークタブで以下を確認：
   - `/api/profile` へのPUTリクエスト
   - Request Headers に `Authorization: Bearer [token]` が含まれているか
   - Consoleタブでデバッグログを確認

## 期待される動作

- ローカルホストでは認証がスキップされ、正常に保存される
- 本番環境では適切な認証チェックが行われる
- 403エラーは発生しない

## トラブルシューティング

もし403エラーが続く場合：

1. localStorageのトークンを確認
```javascript
// ブラウザのコンソールで実行
console.log('Token:', localStorage.getItem('token'));
```

2. サーバーログを確認（ターミナルで表示される）

3. 必要に応じて、一度ログアウトして再ログイン