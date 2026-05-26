import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import {
  getEmployeeById,
  getPrivateEventById,
  updatePrivateEvent,
} from "@/lib/store";
import type { PrivateEventCategory } from "@/types/employee";

type PageProps = {
  params: Promise<{
    id: string;
    eventId: string;
  }>;
};

function getFormValue(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

function getCategoryValue(value: string): PrivateEventCategory {
  const allowed: PrivateEventCategory[] = [
    "family",
    "health",
    "life",
    "career",
    "other",
  ];

  return allowed.includes(value as PrivateEventCategory)
    ? (value as PrivateEventCategory)
    : "other";
}

async function updatePrivateEventAction(
  employeeId: string,
  eventId: string,
  formData: FormData,
) {
  "use server";

  await updatePrivateEvent(employeeId, eventId, {
    eventDate: getFormValue(formData, "eventDate"),
    category: getCategoryValue(getFormValue(formData, "category")),
    title: getFormValue(formData, "title"),
    detail: getFormValue(formData, "detail"),
    memo: getFormValue(formData, "memo"),
  });

  redirect(`/employees/${employeeId}`);
}

export default async function EditPrivateEventPage({ params }: PageProps) {
  const { id, eventId } = await params;
  const employee = await getEmployeeById(id);
  const event = await getPrivateEventById(id, eventId);

  if (!employee || !event) {
    notFound();
  }

  const action = updatePrivateEventAction.bind(null, employee.id, event.id);

  return (
    <>
      <header className="app-header">
        <div className="app-header__inner">
          <Link className="brand-link" href="/">
            <h1>社員カルテDB</h1>
            <p>Employee Profile Database</p>
          </Link>
          <div className="app-header__badge">Edit Private Event</div>
        </div>
      </header>

      <main className="container">
        <section className="page-head">
          <div>
            <p className="eyebrow">Edit Private Event</p>
            <h2>プライベートイベント編集</h2>
            <p className="sub-text">{employee.name} さんのイベントを編集します。</p>
          </div>

          <Link className="btn ghost" href={`/employees/${employee.id}`}>
            詳細へ戻る
          </Link>
        </section>

        <section className="card">
          <form className="employee-form" action={action}>
            <div className="form-grid">
              <label className="form-field">
                <span>日付</span>
                <input
                  type="date"
                  name="eventDate"
                  defaultValue={event.eventDate}
                  required
                />
              </label>

              <label className="form-field">
                <span>カテゴリ</span>
                <select name="category" defaultValue={event.category}>
                  <option value="family">家族</option>
                  <option value="health">健康</option>
                  <option value="life">生活</option>
                  <option value="career">キャリア</option>
                  <option value="other">その他</option>
                </select>
              </label>

              <label className="form-field full">
                <span>タイトル</span>
                <input
                  type="text"
                  name="title"
                  defaultValue={event.title}
                  required
                />
              </label>

              <label className="form-field full">
                <span>内容</span>
                <textarea
                  name="detail"
                  rows={5}
                  defaultValue={event.detail ?? ""}
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