# Slack Webhook設定手順

## 1. Slack Appの作成

1. https://api.slack.com/apps にアクセス
2. **Create New App** をクリック
3. **From scratch** を選択
4. App名: `TAKAYA FILMS Contact Form`
5. ワークスペースを選択

## 2. Incoming Webhookの有効化

1. 左メニューから **Incoming Webhooks** を選択
2. **Activate Incoming Webhooks** をONにする
3. **Add New Webhook to Workspace** をクリック
4. 通知を送信したいチャンネルを選択
5. **Allow** をクリック

## 3. Webhook URLの取得

作成されたWebhook URLをコピーしてください。
形式: `https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX`

## 4. 環境変数に設定

### ローカル開発:
```bash
# .env ファイルに追加
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK
```

### Vercel本番環境:
```bash
npx vercel env add SLACK_WEBHOOK_URL
# 上記でコピーしたWebhook URLを入力
```

または Vercelダッシュボード → Settings → Environment Variables で設定

## 5. 通知内容

コンタクトフォームから送信されると、以下の形式でSlackに通知されます：

```
🎬 TAKAYA FILMS - 新規お問い合わせ

📝 件名: お仕事のご相談

👤 お名前: 田中太郎
📧 メールアドレス: tanaka@example.com

💬 メッセージ:
```
映像制作についてご相談があります。
予算は100万円程度を想定しています。
```

⏰ 受信日時: 2024/12/31 15:30:45
```

## 6. Webhook URLのテスト

URLが正しく動作するか、以下のコマンドでテストできます：

```bash
curl -X POST -H 'Content-Type: application/json' \
--data '{"text":"Hello, World! TAKAYA FILMSからのテストメッセージです。"}' \
YOUR_WEBHOOK_URL_HERE
```

実際のWebhook URLに置き換えて実行：
```bash
curl -X POST -H 'Content-Type: application/json' \
--data '{"text":"Hello, World! TAKAYA FILMSからのテストメッセージです。"}' \
https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK
```

成功すると「ok」が返され、Slackチャンネルにメッセージが届きます。

## トラブルシューティング

- **通知が来ない**: Webhook URLが正しく設定されているか確認
- **権限エラー**: Slackワークスペースの管理者権限が必要な場合があります
- **チャンネル変更**: 新しいWebhookを作成して、URLを更新してください
- **no_text エラー**: メッセージ本文が空でないか確認