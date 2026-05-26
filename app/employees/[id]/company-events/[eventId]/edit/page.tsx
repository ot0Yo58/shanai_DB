import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import {
  getCompanyEventHistoryById,
  getEmployeeById,
  updateCompanyEventHistory,
} from "@/lib/store";
import type { CompanyEventRole } from "@/types/employee";

type PageProps = {
  params: Promise<{
    id: string;
    eventId: string;
  }>;
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

async function updateCompanyEventAction(
  employeeId: string,
  eventId: string,
  formData: FormData,
) {
  "use server";

  await updateCompanyEventHistory(employeeId, eventId, {
    eventDate: getFormValue(formData, "eventDate"),
    eventName: getFormValue(formData, "eventName"),
    role: getRoleValue(getFormValue(formData, "role")),
    impression: getFormValue(formData, "impression"),
    memo: getFormValue(formData, "memo"),
  });

  redirect(`/employees/${employeeId}`);
}

export default async function EditCompanyEventPage({ params }: PageProps) {
  const { id, eventId } = await params;
  const employee = await getEmployeeById(id);
  const event = await getCompanyEventHistoryById(id, eventId);

  if (!employee || !event) {
    notFound();
  }

  const action = updateCompanyEventAction.bind(null, employee.id, event.id);

  return (
    <>
      <header className="app-header">
        <div className="app-header__inner">
          <Link className="brand-link" href="/">
            <h1>社員カルテDB</h1>
            <p>Employee Profile Database</p>
          </Link>
          <div className="app-header__badge">Edit Event</div>
        </div>
      </header>

      <main className="container">
        <section className="page-head">
          <div>
            <p className="eyebrow">Edit Company Event</p>
            <h2>社内イベント参加履歴編集</h2>
            <p className="sub-text">
              {employee.name} さんのイベント履歴を編集します。
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
                <input
                  type="date"
                  name="eventDate"
                  defaultValue={event.eventDate}
                  required
                />
              </label>

              <label className="form-field">
                <span>参加区分</span>
                <select name="role" defaultValue={event.role}>
                  <option value="participant">参加</option>
                  <option value="organizer">運営</option>
                  <option value="speaker">登壇・発表</option>
                  <option value="other">その他</option>
                </select>
              </label>

              <label className="form-field full">
                <span>イベント名</span>
                <input
                  type="text"
                  name="eventName"
                  defaultValue={event.eventName}
                  required
                />
              </label>

              <label className="form-field full">
                <span>所感</span>
                <textarea
                  name="impression"
                  rows={5}
                  defaultValue={event.impression ?? ""}
                />
              </label>

              <label className="form-field full">
                <span>メモ</span>
                <textarea name="memo" rows={4} defaultValue={event.memo ?? ""} />
              </label>
            </div>

            <div className="form-actions">
              <Link className="btn ghost" href={`/employees/${employee.id}`}>
                キャンセル
              </Link>
              <button className="btn primary" type="submit">
                保存する
              </button>
            </div>
          </form>
        </section>
      </main>
    </>
  );
}