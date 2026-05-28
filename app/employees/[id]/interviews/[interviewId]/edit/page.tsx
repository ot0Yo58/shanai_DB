import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { Breadcrumbs } from "@/components/Breadcrumbs";

import {
  getEmployeeById,
  getInterviewHistoryById,
  updateInterviewHistory,
} from "@/lib/store";
import type { InterviewCategory } from "@/types/employee";

type PageProps = {
  params: Promise<{
    id: string;
    interviewId: string;
  }>;
};

function getFormValue(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

function getCategoryValue(value: string): InterviewCategory {
  const allowed: InterviewCategory[] = [
    "regular",
    "career",
    "technical",
    "trouble",
    "other",
  ];

  return allowed.includes(value as InterviewCategory)
    ? (value as InterviewCategory)
    : "regular";
}

async function updateInterviewHistoryAction(
  employeeId: string,
  interviewId: string,
  formData: FormData,
) {
  "use server";

  await updateInterviewHistory(employeeId, interviewId, {
    interviewDate: getFormValue(formData, "interviewDate"),
    interviewer: getFormValue(formData, "interviewer"),
    category: getCategoryValue(getFormValue(formData, "category")),
    summary: getFormValue(formData, "summary"),
    nextAction: getFormValue(formData, "nextAction"),
    nextActionDate: getFormValue(formData, "nextActionDate"),
    memo: getFormValue(formData, "memo"),
  });

  redirect(`/employees/${employeeId}`);
}

export default async function EditInterviewHistoryPage({ params }: PageProps) {
  const { id, interviewId } = await params;
  const employee = await getEmployeeById(id);
  const interview = await getInterviewHistoryById(id, interviewId);

  if (!employee || !interview) {
    notFound();
  }

  const action = updateInterviewHistoryAction.bind(
    null,
    employee.id,
    interview.id,
  );

  return (
    <>
      <header className="app-header">
        <div className="app-header__inner">
          <Link className="brand-link" href="/">
            <h1>社員カルテDB</h1>
            <p>Employee Profile Database</p>
          </Link>

          <div className="app-header__badge">Edit Interview</div>
        </div>
      </header>

      <main className="container">
        <Breadcrumbs
  items={[
    { label: "社員一覧", href: "/" },
    { label: employee.name, href: `/employees/${employee.id}` },
    {
      label: "編集",
      href: `/employees/${employee.id}/edit?section=interviews`,
    },
    { label: "面談履歴追加" },
  ]}
/>
        <section className="page-head">
          <div>
            <p className="eyebrow">Edit Interview History</p>
            <h2>面談履歴編集</h2>
            <p className="sub-text">{employee.name} さんの面談履歴を編集します。</p>
          </div>

          <Link className="btn ghost" href={`/employees/${employee.id}`}>
            詳細へ戻る
          </Link>
        </section>

        <section className="card">
          <form className="employee-form" action={action}>
            <div className="form-grid">
              <label className="form-field">
                <span>面談日</span>
                <input
                  type="date"
                  name="interviewDate"
                  defaultValue={interview.interviewDate}
                  required
                />
              </label>

              <label className="form-field">
                <span>面談者</span>
                <input
                  type="text"
                  name="interviewer"
                  defaultValue={interview.interviewer ?? ""}
                />
              </label>

              <label className="form-field">
                <span>面談種別</span>
                <select name="category" defaultValue={interview.category}>
                  <option value="regular">定期面談</option>
                  <option value="career">キャリア面談</option>
                  <option value="technical">技術面談</option>
                  <option value="trouble">相談・トラブル</option>
                  <option value="other">その他</option>
                </select>
              </label>

              <label className="form-field">
                <span>次回対応日</span>
                <input
                  type="date"
                  name="nextActionDate"
                  defaultValue={interview.nextActionDate ?? ""}
                />
              </label>

              <label className="form-field full">
                <span>面談内容</span>
                <textarea
                  name="summary"
                  rows={5}
                  defaultValue={interview.summary}
                  required
                />
              </label>

              <label className="form-field full">
                <span>次回アクション</span>
                <textarea
                  name="nextAction"
                  rows={4}
                  defaultValue={interview.nextAction ?? ""}
                />
              </label>

              <label className="form-field full">
                <span>メモ</span>
                <textarea
                  name="memo"
                  rows={4}
                  defaultValue={interview.memo ?? ""}
                />
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