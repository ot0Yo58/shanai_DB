export default function Home() {
  return (
    <main style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h1>社員DB Sync API (Next.js + Vercel)</h1>
      <p>GAS連携用エンドポイント:</p>
      <ul>
        <li>GET /api/employees</li>
        <li>POST /api/employees/sync</li>
      </ul>
    </main>
  );
}
