import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { Breadcrumbs } from "@/components/Breadcrumbs";

import { addPrivateEvent, getEmployeeById } from "@/lib/store";
import type { PrivateEventCategory } from "@/types/employee";

type PageProps = {
  params: Promise<{ id: string }>;
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

async function createPrivateEventAction(employeeId: string, formData: FormData) {
  "use server";

  await addPrivateEvent(employeeId, {
    eventDate: getFormValue(formData, "eventDate"),
    category: getCategoryValue(getFormValue(formData, "category")),
    title: getFormValue(formData, "title"),
    detail: getFormValue(formData, "detail"),
    memo: getFormValue(formData, "memo"),
  });

  redirect(`/employees/${employeeId}/edit?section=private-events`);
}

export default async function NewPrivateEventPage({ params }: PageProps) {
  const { id } = await params;
  const employee = await getEmployeeById(id);

  if (!employee) {
    notFound();
  }

  const action = createPrivateEventAction.bind(null, employee.id);

  return (
    <>
      <header className="app-header">
        <div className="app-header__inner">
          <Link className="brand-link" href="/">
            <h1>社員カルテDB</h1>
            <p>Employee Profile Database</p>
          </Link>

          <div className="app-header__badge">Private Event</div>
        </div>
      </header>

      <main className="container">
        <Breadcrumbs
  items={[
    { label: "社員一覧", href: "/" },
    { label: employee.name, href: `/employees/${employee.id}` },
    {
      label: "編集",
      href: `/employees/${employee.id}/edit?section=private-events`,
    },
    { label: "プライベートイベント追加" },
  ]}
/>
        <section className="detail-hero employee-page-hero">
          <div>
            <p className="eyebrow">Add Private Event</p>
            <div className="page-title-row">
              <h2>プライベートイベント追加</h2>
              <span className="page-mode-badge">追加画面</span>
            </div>
            <p className="sub-text">
              {employee.name} さんのイベントを追加します。
            </p>
          </div>

          <div className="page-actions">
            <Link
              className="btn ghost"
              href={`/employees/${employee.id}/edit?section=private-events`}
            >
              編集画面へ戻る
            </Link>
          </div>
        </section>

        <section className="card">
          <form className="employee-form" action={action}>
            <div className="form-grid">
              <label className="form-field">
                <span>日付</span>
                <input type="date" name="eventDate" required />
              </label>

              <label className="form-field">
                <span>カテゴリ</span>
                <select name="category" defaultValue="other">
                  <option value="family">家族</option>
                  <option value="health">健康</option>
                  <option value="life">生活</option>
                  <option value="career">キャリア</option>
                  <option value="other">その他</option>
                </select>
              </label>

              <label className="form-field full">
                <span>タイトル</span>
                <input type="text" name="title" required />
              </label>

              <label className="form-field full">
                <span>内容</span>
                <textarea name="detail" rows={5} />
              </label>

              <label className="form-field full">
                <span>メモ</span>
                <textarea name="memo" rows={4} />
              </label>
            </div>

            <div className="form-actions">
              <Link
                className="btn ghost"
                href={`/employees/${employee.id}/edit?section=private-events`}
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