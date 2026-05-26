import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { addTroubleHistory, getEmployeeById } from "@/lib/store";
import type { TroubleStatus, TroubleType } from "@/types/employee";

type PageProps = {
  params: Promise<{ id: string }>;
};

function getFormValue(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

function getTypeValue(value: string): TroubleType {
  const allowed: TroubleType[] = ["inquiry", "trouble", "request", "other"];
  return allowed.includes(value as TroubleType) ? (value as TroubleType) : "inquiry";
}

function getStatusValue(value: string): TroubleStatus {
  const allowed: TroubleStatus[] = ["open", "in_progress", "resolved", "watching"];
  return allowed.includes(value as TroubleStatus) ? (value as TroubleStatus) : "open";
}

async function createTroubleAction(employeeId: string, formData: FormData) {
  "use server";

  await addTroubleHistory(employeeId, {
    occurredAt: getFormValue(formData, "occurredAt"),
    type: getTypeValue(getFormValue(formData, "type")),
    status: getStatusValue(getFormValue(formData, "status")),
    subject: getFormValue(formData, "subject"),
    detail: getFormValue(formData, "detail"),
    action: getFormValue(formData, "action"),
    resolvedAt: getFormValue(formData, "resolvedAt"),
    memo: getFormValue(formData, "memo"),
  });

  redirect(`/employees/${employeeId}`);
}

export default async function NewTroublePage({ params }: PageProps) {
  const { id } = await params;
  const employee = await getEmployeeById(id);

  if (!employee) {
    notFound();
  }

  const action = createTroubleAction.bind(null, employee.id);

  return (
    <>
      <header className="app-header">
        <div className="app-header__inner">
          <Link className="brand-link" href="/">
            <h1>社員カルテDB</h1>
            <p>Employee Profile Database</p>
          </Link>
          <div className="app-header__badge">Trouble History</div>
        </div>
      </header>

      <main className="container">
        <section className="page-head">
          <div>
            <p className="eyebrow">Add Trouble History</p>
            <h2>問い合わせ・トラブル履歴追加</h2>
            <p className="sub-text">{employee.name} さんの履歴を追加します。</p>
          </div>

          <Link className="btn ghost" href={`/employees/${employee.id}`}>
            詳細へ戻る
          </Link>
        </section>

        <section className="card">
          <form className="employee-form" action={action}>
            <div className="form-grid">
              <label className="form-field">
                <span>発生日</span>
                <input type="date" name="occurredAt" required />
              </label>

              <label className="form-field">
                <span>種別</span>
                <select name="type" defaultValue="inquiry">
                  <option value="inquiry">問い合わせ</option>
                  <option value="trouble">トラブル</option>
                  <option value="request">依頼</option>
                  <option value="other">その他</option>
                </select>
              </label>

              <label className="form-field">
                <span>ステータス</span>
                <select name="status" defaultValue="open">
                  <option value="open">未対応</option>
                  <option value="in_progress">対応中</option>
                  <option value="resolved">解決済み</option>
                  <option value="watching">経過観察</option>
                </select>
              </label>

              <label className="form-field">
                <span>解決日</span>
                <input type="date" name="resolvedAt" />
              </label>

              <label className="form-field full">
                <span>件名</span>
                <input type="text" name="subject" required />
              </label>

              <label className="form-field full">
                <span>内容</span>
                <textarea name="detail" rows={5} />
              </label>

              <label className="form-field full">
                <span>対応内容</span>
                <textarea name="action" rows={5} />
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