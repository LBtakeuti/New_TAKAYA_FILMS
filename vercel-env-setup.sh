#!/bin/bash
# Vercel環境変数設定スクリプト

echo "🚀 TAKAYA FILMS - Vercel環境変数設定"
echo "===================================="

# Supabase設定
echo "Setting SUPABASE_URL..."
echo "https://wnwicjiqedtwxvhupcgh.supabase.co" | npx vercel env add SUPABASE_URL production

echo "Setting SUPABASE_ANON_KEY..."
echo "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indud2ljamlxZWR0d3h2aHVwY2doIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyODk5MjgsImV4cCI6MjA2Njg2NTkyOH0.U-QqKq712Kp6HTrERSsUD_zGMfGq_Q4IpuwBzNhWnvk" | npx vercel env add SUPABASE_ANON_KEY production

echo "Setting NODE_ENV..."
echo "production" | npx vercel env add NODE_ENV production

echo ""
echo "✅ 基本的な環境変数の設定が完了しました！"
echo ""
echo "⚠️  まだ設定が必要な環境変数："
echo "1. JWT_SECRET - jwt-secret-generator.js を実行して生成"
echo "2. SLACK_WEBHOOK_URL - Slackアプリから取得"
echo ""
echo "これらは手動で設定してください："
echo "npx vercel env add JWT_SECRET production"
echo "npx vercel env add SLACK_WEBHOOK_URL production"