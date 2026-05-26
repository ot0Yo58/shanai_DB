import Link from "next/link";
import { notFound, redirect } from "next/navigation";

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

  redirect(`/employees/${employeeId}`);
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
        <section className="page-head">
          <div>
            <p className="eyebrow">Add Company Event</p>
            <h2>社内イベント参加履歴追加</h2>
            <p className="sub-text">
              {employee.name} さんのイベント履歴を追加します。
            </p>
          </div>

          <Link className="btn ghost" href={`/employees/${employee.id}`}>
            詳細へ戻る
          </Link>
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
              <Link className="btn ghost" href={`/employees/${employee.id}`}>
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