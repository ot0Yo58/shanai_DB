# 社員DB Sync（TypeScript版）

Java/Spring構成から **TypeScript + Next.js + Vercel + GAS** 構成に移行しました。

## 技術スタック
- TypeScript
- Next.js (App Router)
- Vercel (デプロイ先)
- Google Apps Script (スプレッドシート同期)

## セットアップ
```bash
npm install
npm run dev
```

`.env.local` に以下を設定してください。

```env
GAS_SYNC_API_TOKEN=your-shared-token
```

## API
- `GET /api/employees`
  - トークン認証付きで社員一覧を返却
- `POST /api/employees/sync`
  - `employees` 配列を受け取り、`id` または `employeeCode` でupsert

認証は `X-GAS-SYNC-TOKEN` ヘッダー、または `token` クエリで行います。

## GAS
Apps Scriptには `scripts/gas/employee-sync.ts` の内容をベースに貼り付けてください。
