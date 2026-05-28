import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { Breadcrumbs } from "@/components/Breadcrumbs";

import { addCompanyEventHistory, getEmployeeById } from "@/lib/store";
import type { CompanyEventRole } from "@/types/employee";

type PageProps = {
  params: Promise<{ id: string }>;
};

function getFormValue(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

function getRoleValue(value: string): CompanyEventRole {
  const allowed: CompanyEventRole[] = [
    "participant",
    "organizer",
    "speaker",
    "other",
  ];

  return allowed.includes(value as CompanyEventRole)
    ? (value as CompanyEventRole)
    : "participant";
}

async function createCompanyEventAction(employeeId: string, formData: FormData) {
  "use server";

  await addCompanyEventHistory(employeeId, {
    eventDate: getFormValue(formData, "eventDate"),
    eventName: getFormValue(formData, "eventName"),
    role: getRoleValue(getFormValue(formData, "role")),
    impression: getFormValue(formData, "impression"),
    memo: getFormValue(formData, "memo"),
  });

  redirect(`/employees/${employeeId}/edit?section=company-events`);
}

export default async function NewCompanyEventPage({ params }: PageProps) {
  const { id } = await params;
  const employee = await getEmployeeById(id);

  if (!employee) {
    notFound();
  }

  const action = createCompanyEventAction.bind(null, employee.id);

  return (
    <>
      <header className="app-header">
        <div className="app-header__inner">
          <Link className="brand-link" href="/">
            <h1>社員カルテDB</h1>
            <p>Employee Profile Database</p>
          </Link>

          <div className="app-header__badge">Company Event</div>
        </div>
      </header>

      <main className="container">
        <Breadcrumbs
  items={[
    { label: "社員一覧", href: "/" },
    { label: employee.name, href: `/employees/${employee.id}` },
    {
      label: "編集",
      href: `/employees/${employee.id}/edit?section=company-events`,
    },
    { label: "社内イベント参加履歴追加" },
  ]}
/>
        <section className="detail-hero employee-page-hero">
          <div>
            <p className="eyebrow">Add Company Event</p>
            <div className="page-title-row">
              <h2>社内イベント参加履歴追加</h2>
              <span className="page-mode-badge">追加画面</span>
            </div>
            <p className="sub-text">
              {employee.name} さんのイベント履歴を追加します。
            </p>
          </div>

          <div className="page-actions">
            <Link
              className="btn ghost"
              href={`/employees/${employee.id}/edit?section=company-events`}
            >
              編集画面へ戻る
            </Link>
          </div>
        </section>

        <section className="card">
          <form className="employee-form" action={action}>
            <div className="form-grid">
              <label className="form-field">
                <span>イベント日</span>
                <input type="date" name="eventDate" required />
              </label>

              <label className="form-field">
                <span>参加区分</span>
                <select name="role" defaultValue="participant">
                  <option value="participant">参加</option>
                  <option value="organizer">運営</option>
                  <option value="speaker">登壇・発表</option>
                  <option value="other">その他</option>
                </select>
              </label>

              <label className="form-field full">
                <span>イベント名</span>
                <input type="text" name="eventName" required />
              </label>

              <label className="form-field full">
                <span>所感</span>
                <textarea name="impression" rows={5} />
              </label>

              <label className="form-field full">
                <span>メモ</span>
                <textarea name="memo" rows={4} />
              </label>
            </div>

            <div className="form-actions">
              <Link
                className="btn ghost"
                href={`/employees/${employee.id}/edit?section=company-events`}
              >
                キャンセル
              </Link>

              <button className="btn primary" type="submit">
                追加する
              </button>
            </div>
          </form>
        </section>
      </main>
    </>
  );
}