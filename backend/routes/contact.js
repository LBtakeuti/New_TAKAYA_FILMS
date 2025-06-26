const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

// Gmail SMTP設定
const createTransporter = () => {
    return nodemailer.createTransporter({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_APP_PASSWORD
        }
    });
};

// コンタクトフォーム送信
router.post('/send', async (req, res) => {
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

        const transporter = createTransporter();

        // 管理者向けメール
        const adminMailOptions = {
            from: process.env.GMAIL_USER,
            to: process.env.ADMIN_EMAIL || process.env.GMAIL_USER,
            subject: `【TAKAYA FILMS】新規お問い合わせ: ${subject}`,
            html: `
                <div style="font-family: 'Hiragino Sans', 'Yu Gothic Medium', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f8f9fa;">
                    <div style="background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                        <h2 style="color: #333; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 30px;">新規お問い合わせ</h2>
                        
                        <div style="margin-bottom: 20px;">
                            <strong style="color: #666;">お名前:</strong><br>
                            <span style="font-size: 16px; color: #333;">${name}</span>
                        </div>
                        
                        <div style="margin-bottom: 20px;">
                            <strong style="color: #666;">メールアドレス:</strong><br>
                            <span style="font-size: 16px; color: #333;">${email}</span>
                        </div>
                        
                        <div style="margin-bottom: 20px;">
                            <strong style="color: #666;">件名:</strong><br>
                            <span style="font-size: 16px; color: #333;">${subject}</span>
                        </div>
                        
                        <div style="margin-bottom: 20px;">
                            <strong style="color: #666;">メッセージ:</strong><br>
                            <div style="background: #f8f9fa; padding: 20px; border-radius: 4px; margin-top: 10px; line-height: 1.6; color: #333; white-space: pre-wrap;">${message}</div>
                        </div>
                        
                        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 14px;">
                            送信日時: ${new Date().toLocaleString('ja-JP')}
                        </div>
                    </div>
                </div>
            `
        };

        // 自動返信メール
        const autoReplyOptions = {
            from: process.env.GMAIL_USER,
            to: email,
            subject: '【TAKAYA FILMS】お問い合わせありがとうございます',
            html: `
                <div style="font-family: 'Hiragino Sans', 'Yu Gothic Medium', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f8f9fa;">
                    <div style="background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                        <h2 style="color: #333; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 30px;">お問い合わせありがとうございます</h2>
                        
                        <p style="line-height: 1.8; color: #333; margin-bottom: 20px;">
                            ${name} 様
                        </p>
                        
                        <p style="line-height: 1.8; color: #333; margin-bottom: 20px;">
                            この度は、TAKAYA FILMSにお問い合わせいただき、誠にありがとうございます。<br>
                            以下の内容でお問い合わせを承りました。
                        </p>
                        
                        <div style="background: #f8f9fa; padding: 20px; border-radius: 4px; margin: 20px 0;">
                            <div style="margin-bottom: 15px;">
                                <strong style="color: #666;">件名:</strong> ${subject}
                            </div>
                            <div>
                                <strong style="color: #666;">メッセージ:</strong><br>
                                <div style="margin-top: 10px; color: #333; white-space: pre-wrap;">${message}</div>
                            </div>
                        </div>
                        
                        <p style="line-height: 1.8; color: #333; margin-bottom: 20px;">
                            内容を確認の上、2〜3営業日以内にご返信させていただきます。<br>
                            お急ぎの場合は、直接お電話にてお問い合わせください。
                        </p>
                        
                        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                            <p style="color: #666; font-size: 14px; margin: 0;">
                                TAKAYA FILMS<br>
                                鳥谷部 貴哉<br>
                                Commercial Production / Music Video / Documentary
                            </p>
                        </div>
                    </div>
                </div>
            `
        };

        // メール送信
        await transporter.sendMail(adminMailOptions);
        await transporter.sendMail(autoReplyOptions);

        res.json({ 
            success: true, 
            message: 'お問い合わせを送信しました。ご連絡ありがとうございます。' 
        });

    } catch (error) {
        console.error('Contact form error:', error);
        res.status(500).json({ 
            error: 'メール送信に失敗しました。しばらく時間をおいて再度お試しください。' 
        });
    }
});

module.exports = router;