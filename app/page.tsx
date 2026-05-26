import Link from "next/link";

import EmployeeTable from "./components/EmployeeTable";
import { listEmployees } from "@/lib/store";
import type { Employee } from "@/types/employee";

type SearchParams = {
  q?: string | string[];
};

type PageProps = {
  searchParams?: Promise<SearchParams>;
};

function getSearchText(value: string | string[] | undefined): string {
  if (Array.isArray(value)) {
    return value[0]?.trim() ?? "";
  }

  return value?.trim() ?? "";
}

function matchesKeyword(employee: Employee, keyword: string): boolean {
  if (!keyword) {
    return true;
  }

  const targetText = [
    employee.id,
    employee.employeeCode,
    employee.name,
    employee.nameKana,
    employee.birthday,
    employee.address,
    employee.joinDate,
    employee.commuteMethod,
    employee.futureVision,
    employee.memo,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return targetText.includes(keyword.toLowerCase());
}

export default async function Home({ searchParams }: PageProps) {
  const params = searchParams ? await searchParams : {};
  const q = getSearchText(params.q);

  const employees = await listEmployees();
  const filteredEmployees = employees.filter((employee) =>
    matchesKeyword(employee, q),
  );

  return (
    <>
      <header className="app-header">
        <div className="app-header__inner">
          <Link className="brand-link" href="/">
            <h1>社員カルテDB</h1>
            <p>Employee Profile Database</p>
          </Link>

          <div className="app-header__badge">Next.js / Vercel</div>
        </div>
      </header>

      <main className="container">
        <section className="page-head">
          <div>
            <p className="eyebrow">Employee List</p>
            <h2>社員一覧</h2>
            <p className="sub-text">
              社員情報、Cytech進捗、面談履歴、問い合わせ履歴を管理します。
            </p>
          </div>

          <Link className="btn primary" href="/employees/new">
            ＋ 社員登録
          </Link>
        </section>

        <section className="stats-grid" aria-label="社員データ概要">
          <div className="stat-card">
            <span className="stat-label">登録社員数</span>
            <strong>{employees.length}</strong>
          </div>

          <div className="stat-card">
            <span className="stat-label">検索結果</span>
            <strong>{filteredEmployees.length}</strong>
          </div>

          <div className="stat-card">
            <span className="stat-label">保存方式</span>
            <strong>JSON仮</strong>
          </div>
        </section>

        <section className="card">
          <form className="search-form" action="/" method="get">
            <input
              type="text"
              name="q"
              defaultValue={q}
              placeholder="名前・社員番号・カナなどで検索"
            />

            <button className="btn" type="submit">
              検索
            </button>

            <Link className="btn ghost" href="/">
              クリア
            </Link>
          </form>
        </section>

        <section className="card">
          <div className="section-title-row">
            <div>
              <h3>社員データ</h3>
              <p className="section-help pc-help">
                社員の行をダブルクリックすると詳細画面を開けます。
              </p>
              <p className="section-help sp-help">
                スマホでは社員ごとのカード形式で表示されます。
              </p>
            </div>

            <span className="badge">社員一覧</span>
          </div>

          <EmployeeTable employees={filteredEmployees} searchText={q} />
        </section>
      </main>
    </>
  );
}