# Slack通知の有効化手順

## 現在の状況
- Webhook URLが無効（no_serviceエラー）
- 開発モードでコンソールログに出力中
- お問い合わせフォームは正常動作

## 新しいWebhook URLの設定方法

1. 新しいWebhook URLを取得後、以下のファイルを編集：
   ```
   app/api/contact/route.ts
   ```

2. 以下の行を変更：
   ```javascript
   const isDevelopmentMode = true; // これを false に変更
   const slackWebhookUrl = '新しいWebhook URL'; // URLを更新
   ```

3. サーバーを再起動：
   ```bash
   npm run dev
   ```

## Webhook URL作成手順

1. https://api.slack.com/apps にアクセス
2. ワークスペースを選択
3. 「Incoming Webhooks」を有効化
4. 「Add New Webhook to Workspace」
5. チャンネルを選択して許可
6. 生成されたURLをコピー

## 現在のログ出力場所
開発サーバーのターミナルでお問い合わせ内容を確認できます。