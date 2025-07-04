import { NextRequest, NextResponse } from 'next/server';

// Slack通知送信関数
const sendSlackMessage = async (formData: { name: string; email: string; subject: string; message: string }): Promise<{ success: boolean; simulated: boolean }> => {
  const slackWebhookUrl = 'https://hooks.slack.com/services/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';

  // Slack Block Kit形式でリッチなメッセージを作成
  const slackMessage = {
    text: "新しいお問い合わせが届きました！",
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: "🎬 TAKAYA FILMS - 新規お問い合わせ",
          emoji: true
        }
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: `*👤 お名前:*\n${formData.name}`
          },
          {
            type: "mrkdwn",
            text: `*📧 メールアドレス:*\n${formData.email}`
          }
        ]
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: `*📝 件名:*\n${formData.subject}`
          },
          {
            type: "mrkdwn",
            text: `*⏰ 受信日時:*\n${new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })}`
          }
        ]
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*💬 メッセージ:*\n\`\`\`${formData.message}\`\`\``
        }
      },
      {
        type: "divider"
      },
      {
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: "TAKAYA FILMS ウェブサイトのお問い合わせフォームより送信"
          }
        ]
      }
    ]
  };

  try {
    const response = await fetch(slackWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(slackMessage)
    });

    if (!response.ok) {
      const responseText = await response.text();
      throw new Error(`Slack API returned status ${response.status}: ${responseText}`);
    }

    return { success: true, simulated: false };
  } catch (error) {
    console.error('Slack送信エラー:', error);
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

    // Slack通知送信
    const result = await sendSlackMessage({ name, email, subject, message });

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