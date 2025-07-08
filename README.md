This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## 環境設定

### Supabase設定（動画アップロード機能を使用する場合）

1. [Supabase](https://supabase.com)でプロジェクトを作成
2. プロジェクトの設定からAPI URLとAnon Keyを取得
3. `.env.local`ファイルを作成し、環境変数を設定：

```bash
cp .env.local.example .env.local
# .env.localファイルを編集して、実際の値を設定
```

4. Supabaseダッシュボードでストレージバケットを作成：
   - `videos` - 動画ファイル用（公開バケット）
   - `thumbnails` - サムネイル用（公開バケット）

### 注意事項

- Supabase設定なしでも基本機能は動作しますが、動画ファイルアップロードは利用できません
- YouTube URLでの動画投稿は常に利用可能です

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
