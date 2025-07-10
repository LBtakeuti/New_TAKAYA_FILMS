import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/utils/logger';
import { handleApiError, ValidationError } from '@/middleware/error';
import { handleCors, corsHeaders } from '@/middleware/cors';

// 環境変数からSlack Webhook URLを取得
const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;

// Slack通知送信関数（開発モード対応）
const sendSlackMessage = async (formData: { name: string; email: string; subject: string; message: string }): Promise<{ success: boolean; simulated: boolean }> => {
  const slackWebhookUrl = SLACK_WEBHOOK_URL;
  
  // Webhook URLが設定されていない場合はコンソールログに出力
  if (!slackWebhookUrl) {
    logger.log('Slack Webhook URL not configured, using console output');
  }
  
  if (!slackWebhookUrl) {
    logger.log('=== 📧 TAKAYA FILMS - 新規お問い合わせ ===');
    logger.log(`👤 お名前: ${formData.name}`);
    logger.log(`📧 メールアドレス: ${formData.email}`);
    logger.log(`📝 件名: ${formData.subject}`);
    logger.log(`⏰ 受信日時: ${new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })}`);
    logger.log(`💬 メッセージ:\n${formData.message}`);
    logger.log('============================================');
    return { success: true, simulated: true };
  }

  // シンプルなSlackメッセージを作成
  const slackMessage = {
    text: `🎬 TAKAYA FILMS - 新規お問い合わせ\n\n👤 お名前: ${formData.name}\n📧 メールアドレス: ${formData.email}\n📝 件名: ${formData.subject}\n⏰ 受信日時: ${new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })}\n\n💬 メッセージ:\n${formData.message}\n\n---\nTAKAYA FILMS ウェブサイトのお問い合わせフォームより送信`
  };

  try {
    logger.log('Slack送信開始 - Webhook URL:', slackWebhookUrl);
    logger.log('送信メッセージ:', JSON.stringify(slackMessage, null, 2));
    
    const response = await fetch(slackWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(slackMessage)
    });

    logger.log('Slack API レスポンス:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok
    });

    if (!response.ok) {
      const responseText = await response.text();
      logger.error('Slack API エラー内容:', responseText);
      throw new Error(`Slack API returned status ${response.status}: ${responseText}`);
    }

    const responseText = await response.text();
    logger.log('Slack送信成功:', responseText);
    
    return { success: true, simulated: false };
  } catch (error) {
    logger.error('Slack送信エラー:', error);
    logger.error('エラー詳細:', error instanceof Error ? error.message : String(error));
    // Slackエラー時はコンソールログに出力（フォールバック）
    logger.log('=== 🚨 Slackエラー - コンソールログに出力 ===');
    logger.log(`👤 お名前: ${formData.name}`);
    logger.log(`📧 メールアドレス: ${formData.email}`);
    logger.log(`📝 件名: ${formData.subject}`);
    logger.log(`⏰ 受信日時: ${new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })}`);
    logger.log(`💬 メッセージ: ${formData.message}`);
    logger.log('==========================================');
    
    // エラーでもユーザーには成功を返す（フォールバック運用）
    return { success: true, simulated: true };
  }
};

// POST: コンタクトフォーム送信
export async function POST(request: NextRequest) {
  // Handle CORS preflight
  const corsResponse = handleCors(request);
  if (corsResponse) return corsResponse;

  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // バリデーション
    if (!name || !email || !subject || !message) {
      throw new ValidationError('全ての項目を入力してください');
    }

    // Eメール形式チェック
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new ValidationError('有効なメールアドレスを入力してください');
    }

    logger.log('Slack送信開始:', { name, email, subject });
    
    // Slack通知送信
    const result = await sendSlackMessage({ name, email, subject, message });
    
    logger.log('Slack送信結果:', result);

    return NextResponse.json({ 
      success: true, 
      message: 'お問い合わせを送信しました。ご連絡ありがとうございます。'
    }, {
      headers: corsHeaders(request)
    });

  } catch (error) {
    return handleApiError(error);
  }
}

// OPTIONS: CORS preflight
export async function OPTIONS(request: NextRequest) {
  return handleCors(request) || new NextResponse(null, { status: 200 });
}