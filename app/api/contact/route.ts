import { NextRequest, NextResponse } from 'next/server';

// Slack通知送信関数（開発モード対応）
const sendSlackMessage = async (formData: { name: string; email: string; subject: string; message: string }): Promise<{ success: boolean; simulated: boolean }> => {
  const slackWebhookUrl = 'https://hooks.slack.com/services/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';
  
  // 開発モードまたはWebhook URL無効時はコンソールログに出力
  const isDevelopmentMode = false; // 本番モードに設定
  
  if (isDevelopmentMode) {
    console.log('=== 📧 TAKAYA FILMS - 新規お問い合わせ ===');
    console.log(`👤 お名前: ${formData.name}`);
    console.log(`📧 メールアドレス: ${formData.email}`);
    console.log(`📝 件名: ${formData.subject}`);
    console.log(`⏰ 受信日時: ${new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })}`);
    console.log(`💬 メッセージ:\n${formData.message}`);
    console.log('============================================');
    return { success: true, simulated: true };
  }

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
    console.log('Slack送信開始 - Webhook URL:', slackWebhookUrl);
    console.log('送信メッセージ:', JSON.stringify(slackMessage, null, 2));
    
    const response = await fetch(slackWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(slackMessage)
    });

    console.log('Slack API レスポンス:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok
    });

    if (!response.ok) {
      const responseText = await response.text();
      console.error('Slack API エラー内容:', responseText);
      throw new Error(`Slack API returned status ${response.status}: ${responseText}`);
    }

    const responseText = await response.text();
    console.log('Slack送信成功:', responseText);
    
    return { success: true, simulated: false };
  } catch (error) {
    console.error('Slack送信エラー:', error);
    console.error('エラー詳細:', error instanceof Error ? error.message : String(error));
    // Slackエラー時はコンソールログに出力（フォールバック）
    console.log('=== 🚨 Slackエラー - コンソールログに出力 ===');
    console.log(`👤 お名前: ${formData.name}`);
    console.log(`📧 メールアドレス: ${formData.email}`);
    console.log(`📝 件名: ${formData.subject}`);
    console.log(`⏰ 受信日時: ${new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })}`);
    console.log(`💬 メッセージ: ${formData.message}`);
    console.log('==========================================');
    
    // エラーでもユーザーには成功を返す（フォールバック運用）
    return { success: true, simulated: true };
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

    console.log('Slack送信開始:', { name, email, subject });
    
    // Slack通知送信
    const result = await sendSlackMessage({ name, email, subject, message });
    
    console.log('Slack送信結果:', result);

    return NextResponse.json({ 
      success: true, 
      message: 'お問い合わせを送信しました。ご連絡ありがとうございます。' 
    });

  } catch (error) {
    console.error('Contact form error:', error);
    console.error('エラー詳細:', error instanceof Error ? error.message : String(error));
    console.error('スタックトレース:', error instanceof Error ? error.stack : 'N/A');
    return NextResponse.json({ 
      error: 'お問い合わせの送信に失敗しました。しばらく時間をおいて再度お試しください。',
      debug: process.env.NODE_ENV === 'development' ? String(error) : undefined
    }, { status: 500 });
  }
}