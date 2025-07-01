const https = require('https');

// Slack Webhook設定
const sendSlackMessage = (message) => {
    return new Promise((resolve, reject) => {
        if (!process.env.SLACK_WEBHOOK_URL) {
            console.log('Slack webhook URL not configured. Notification will be simulated.');
            console.log('=== コンタクトフォーム送信（シミュレーション） ===');
            console.log(message);
            console.log('=======================================');
            resolve({ success: true, simulated: true });
            return;
        }

        const data = JSON.stringify({
            text: message,
            username: 'TAKAYA FILMS Contact Form',
            icon_emoji: ':email:'
        });

        const url = new URL(process.env.SLACK_WEBHOOK_URL);
        const options = {
            hostname: url.hostname,
            port: 443,
            path: url.pathname,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }
        };

        const req = https.request(options, (res) => {
            let responseData = '';
            res.on('data', (chunk) => {
                responseData += chunk;
            });
            res.on('end', () => {
                if (res.statusCode === 200) {
                    resolve({ success: true, simulated: false });
                } else {
                    reject(new Error(`Slack API returned status ${res.statusCode}: ${responseData}`));
                }
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        req.write(data);
        req.end();
    });
};

// コンタクトフォーム送信
exports.sendContact = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        // バリデーション
        if (!name || !email || !subject || !message) {
            return res.status(400).json({ error: '全ての項目を入力してください' });
        }

        // Eメール形式チェック
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: '有効なメールアドレスを入力してください' });
        }

        // Slack通知メッセージ作成
        const slackMessage = `
🎬 *TAKAYA FILMS - 新規お問い合わせ*

📝 *件名:* ${subject}

👤 *お名前:* ${name}
📧 *メールアドレス:* ${email}

💬 *メッセージ:*
\`\`\`
${message}
\`\`\`

⏰ *受信日時:* ${new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })}
        `.trim();

        // Slack通知送信
        const result = await sendSlackMessage(slackMessage);

        if (result.simulated) {
            return res.json({ 
                success: true, 
                message: 'お問い合わせを受け付けました。（開発モード）' 
            });
        }

        res.json({ 
            success: true, 
            message: 'お問い合わせを送信しました。ご連絡ありがとうございます。' 
        });

    } catch (error) {
        console.error('Contact form error:', error);
        res.status(500).json({ 
            error: 'お問い合わせの送信に失敗しました。しばらく時間をおいて再度お試しください。' 
        });
    }
};