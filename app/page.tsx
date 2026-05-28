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

const CYTECH_STATUS_LABELS: Record<string, string> = {
  not_started: "未着手",
  in_progress: "進行中",
  completed: "完了",
  blocked: "詰まり中",
};

const INTERVIEW_CATEGORY_LABELS: Record<string, string> = {
  regular: "定期面談",
  career: "キャリア",
  technical: "技術",
  trouble: "トラブル",
  other: "その他",
};

const TROUBLE_TYPE_LABELS: Record<string, string> = {
  inquiry: "問い合わせ",
  trouble: "トラブル",
  request: "要望",
  other: "その他",
};

const TROUBLE_STATUS_LABELS: Record<string, string> = {
  open: "未対応",
  in_progress: "対応中",
  resolved: "解決済み",
  watching: "経過観察",
};

const COMPANY_EVENT_ROLE_LABELS: Record<string, string> = {
  participant: "参加者",
  organizer: "運営",
  speaker: "登壇者",
  other: "その他",
};

const PRIVATE_EVENT_CATEGORY_LABELS: Record<string, string> = {
  family: "家族",
  health: "健康",
  life: "生活",
  career: "キャリア",
  other: "その他",
};

function getSearchText(value: string | string[] | undefined): string {
  if (Array.isArray(value)) {
    return value[0]?.trim() ?? "";
  }

  return value?.trim() ?? "";
}

function normalizeText(value: string): string {
  return value.toLowerCase();
}

function joinSearchValues(values: Array<string | undefined>): string {
  return values
    .filter((value): value is string => Boolean(value && value.trim() !== ""))
    .join(" ")
    .toLowerCase();
}

function createEmployeeSearchText(employee: Employee): string {
  const basicInfoTexts = [
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
    employee.createdAt,
    employee.updatedAt,
  ];

  const cytechTexts = (employee.cytechProgress ?? []).flatMap((progress) => [
    progress.id,
    progress.step,
    progress.title,
    progress.status,
    CYTECH_STATUS_LABELS[progress.status],
    progress.startedAt,
    progress.completedAt,
    progress.memo,
    progress.createdAt,
    progress.updatedAt,
  ]);

  const interviewTexts = (employee.interviewHistory ?? []).flatMap(
    (interview) => [
      interview.id,
      interview.interviewDate,
      interview.interviewer,
      interview.category,
      INTERVIEW_CATEGORY_LABELS[interview.category],
      interview.summary,
      interview.nextAction,
      interview.nextActionDate,
      interview.memo,
      interview.createdAt,
      interview.updatedAt,
    ],
  );

  const troubleTexts = (employee.troubleHistory ?? []).flatMap((trouble) => [
    trouble.id,
    trouble.occurredAt,
    trouble.type,
    TROUBLE_TYPE_LABELS[trouble.type],
    trouble.status,
    TROUBLE_STATUS_LABELS[trouble.status],
    trouble.subject,
    trouble.detail,
    trouble.action,
    trouble.resolvedAt,
    trouble.memo,
    trouble.createdAt,
    trouble.updatedAt,
  ]);

  const companyEventTexts = (employee.companyEventHistory ?? []).flatMap(
    (event) => [
      event.id,
      event.eventDate,
      event.eventName,
      event.role,
      COMPANY_EVENT_ROLE_LABELS[event.role],
      event.impression,
      event.memo,
      event.createdAt,
      event.updatedAt,
    ],
  );

  const privateEventTexts = (employee.privateEvents ?? []).flatMap((event) => [
    event.id,
    event.eventDate,
    event.category,
    PRIVATE_EVENT_CATEGORY_LABELS[event.category],
    event.title,
    event.detail,
    event.memo,
    event.createdAt,
    event.updatedAt,
  ]);

  return joinSearchValues([
    ...basicInfoTexts,
    ...cytechTexts,
    ...interviewTexts,
    ...troubleTexts,
    ...companyEventTexts,
    ...privateEventTexts,
  ]);
}

function matchesKeyword(employee: Employee, keyword: string): boolean {
  const trimmedKeyword = keyword.trim();

  if (!trimmedKeyword) {
    return true;
  }

  const searchTargetText = createEmployeeSearchText(employee);

  const keywords = normalizeText(trimmedKeyword)
    .split(/\s+/)
    .filter(Boolean);

  return keywords.every((word) => searchTargetText.includes(word));
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
        <section className="detail-hero employee-page-hero">
          <div>
            <p className="eyebrow">Employee List</p>
            <div className="page-title-row">
              <h2>社員一覧</h2>
              <span className="page-mode-badge">一覧画面</span>
            </div>
            <p className="sub-text">
              社員情報、Cytech進捗、面談履歴、問い合わせ履歴を管理します。
            </p>
          </div>

          <div className="page-actions">
            <Link className="btn primary" href="/employees/new">
              ＋ 社員登録
            </Link>
          </div>
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
              placeholder="名前・社員番号・焼肉・面談内容などで検索"
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