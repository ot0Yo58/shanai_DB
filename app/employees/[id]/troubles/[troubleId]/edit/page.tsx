import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import {
  getEmployeeById,
  getTroubleHistoryById,
  updateTroubleHistory,
} from "@/lib/store";
import type { TroubleStatus, TroubleType } from "@/types/employee";

type PageProps = {
  params: Promise<{
    id: string;
    troubleId: string;
  }>;
};

function getFormValue(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

function getTypeValue(value: string): TroubleType {
  const allowed: TroubleType[] = ["inquiry", "trouble", "request", "other"];
  return allowed.includes(value as TroubleType)
    ? (value as TroubleType)
    : "inquiry";
}

function getStatusValue(value: string): TroubleStatus {
  const allowed: TroubleStatus[] = [
    "open",
    "in_progress",
    "resolved",
    "watching",
  ];

  return allowed.includes(value as TroubleStatus)
    ? (value as TroubleStatus)
    : "open";
}

async function updateTroubleAction(
  employeeId: string,
  troubleId: string,
  formData: FormData,
) {
  "use server";

  await updateTroubleHistory(employeeId, troubleId, {
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

export default async function EditTroublePage({ params }: PageProps) {
  const { id, troubleId } = await params;
  const employee = await getEmployeeById(id);
  const trouble = await getTroubleHistoryById(id, troubleId);

  if (!employee || !trouble) {
    notFound();
  }

  const action = updateTroubleAction.bind(null, employee.id, trouble.id);

  return (
    <>
      <header className="app-header">
        <div className="app-header__inner">
          <Link className="brand-link" href="/">
            <h1>社員カルテDB</h1>
            <p>Employee Profile Database</p>
          </Link>
          <div className="app-header__badge">Edit Trouble</div>
        </div>
      </header>

      <main className="container">
        <section className="page-head">
          <div>
            <p className="eyebrow">Edit Trouble History</p>
            <h2>問い合わせ・トラブル履歴編集</h2>
            <p className="sub-text">
              {employee.name} さんの履歴を編集します。
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
                <span>発生日</span>
                <input
                  type="date"
                  name="occurredAt"
                  defaultValue={trouble.occurredAt}
                  required
                />
              </label>

              <label className="form-field">
                <span>種別</span>
                <select name="type" defaultValue={trouble.type}>
                  <option value="inquiry">問い合わせ</option>
                  <option value="trouble">トラブル</option>
                  <option value="request">依頼</option>
                  <option value="other">その他</option>
                </select>
              </label>

              <label className="form-field">
                <span>ステータス</span>
                <select name="status" defaultValue={trouble.status}>
                  <option value="open">未対応</option>
                  <option value="in_progress">対応中</option>
                  <option value="resolved">解決済み</option>
                  <option value="watching">経過観察</option>
                </select>
              </label>

              <label className="form-field">
                <span>解決日</span>
                <input
                  type="date"
                  name="resolvedAt"
                  defaultValue={trouble.resolvedAt ?? ""}
                />
              </label>

              <label className="form-field full">
                <span>件名</span>
                <input
                  type="text"
                  name="subject"
                  defaultValue={trouble.subject}
                  required
                />
              </label>

              <label className="form-field full">
                <span>内容</span>
                <textarea
                  name="detail"
                  rows={5}
                  defaultValue={trouble.detail ?? ""}
                />
              </label>

              <label className="form-field full">
                <span>対応内容</span>
                <textarea
                  name="action"
                  rows={5}
                  defaultValue={trouble.action ?? ""}
                />
              </label>

              <label className="form-field full">
                <span>メモ</span>
                <textarea name="memo" rows={4} defaultValue={trouble.memo ?? ""} />
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