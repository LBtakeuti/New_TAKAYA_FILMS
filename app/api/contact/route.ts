import { NextRequest, NextResponse } from 'next/server';

// Slack通知送信関数
const sendSlackMessage = async (message: string): Promise<{ success: boolean; simulated: boolean }> => {
  if (!process.env.SLACK_WEBHOOK_URL) {
    console.log('Slack webhook URL not configured. Notification will be simulated.');
    console.log('=== コンタクトフォーム送信（シミュレーション） ===');
    console.log(message);
    console.log('=======================================');
    return { success: true, simulated: true };
  }

  try {
    const response = await fetch(process.env.SLACK_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: message,
        username: 'TAKAYA FILMS Contact Form',
        icon_emoji: ':email:'
      })
    });

    if (!response.ok) {
      const responseText = await response.text();
      throw new Error(`Slack API returned status ${response.status}: ${responseText}`);
    }

    return { success: true, simulated: false };
  } catch (error) {
    throw error;
  }
};

// POST: コンタクトフォーム送信
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // バリデーション
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: '全ての項目を入力してください' }, { status: 400 });
    }

    // Eメール形式チェック
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: '有効なメールアドレスを入力してください' }, { status: 400 });
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
      return NextResponse.json({ 
        success: true, 
        message: 'お問い合わせを受け付けました。（開発モード）' 
      });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'お問い合わせを送信しました。ご連絡ありがとうございます。' 
    });

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json({ 
      error: 'お問い合わせの送信に失敗しました。しばらく時間をおいて再度お試しください。' 
    }, { status: 500 });
  }
}