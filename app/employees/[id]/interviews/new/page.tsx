import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { Breadcrumbs } from "@/components/Breadcrumbs";

import { addInterviewHistory, getEmployeeById } from "@/lib/store";
import type { InterviewCategory } from "@/types/employee";

type PageProps = {
  params: Promise<{
    id: string;
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

async function createInterviewHistoryAction(
  employeeId: string,
  formData: FormData,
) {
  "use server";

  await addInterviewHistory(employeeId, {
    interviewDate: getFormValue(formData, "interviewDate"),
    interviewer: getFormValue(formData, "interviewer"),
    category: getCategoryValue(getFormValue(formData, "category")),
    summary: getFormValue(formData, "summary"),
    nextAction: getFormValue(formData, "nextAction"),
    nextActionDate: getFormValue(formData, "nextActionDate"),
    memo: getFormValue(formData, "memo"),
  });

  redirect(`/employees/${employeeId}/edit?section=interviews`);
}

export default async function NewInterviewHistoryPage({ params }: PageProps) {
  const { id } = await params;
  const employee = await getEmployeeById(id);

  if (!employee) {
    notFound();
  }

  const action = createInterviewHistoryAction.bind(null, employee.id);

  return (
    <>
      <header className="app-header">
        <div className="app-header__inner">
          <Link className="brand-link" href="/">
            <h1>社員カルテDB</h1>
            <p>Employee Profile Database</p>
          </Link>

          <div className="app-header__badge">Interview History</div>
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

        <section className="detail-hero employee-page-hero">
          <div>
            <p className="eyebrow">Add Interview History</p>
            <div className="page-title-row">
              <h2>面談履歴追加</h2>
              <span className="page-mode-badge">追加画面</span>
            </div>
            <p className="sub-text">
              {employee.name} さんの面談履歴を追加します。
            </p>
          </div>

          <div className="page-actions">
            <Link
              className="btn ghost"
              href={`/employees/${employee.id}/edit?section=interviews`}
            >
              編集画面へ戻る
            </Link>
          </div>
        </section>

        <section className="card">
          <form className="employee-form" action={action}>
            <div className="form-grid">
              <label className="form-field">
                <span>面談日</span>
                <input type="date" name="interviewDate" required />
              </label>

              <label className="form-field">
                <span>面談者</span>
                <input
                  type="text"
                  name="interviewer"
                  placeholder="例：三浦"
                />
              </label>

              <label className="form-field">
                <span>面談種別</span>
                <select name="category" defaultValue="regular">
                  <option value="regular">定期面談</option>
                  <option value="career">キャリア面談</option>
                  <option value="technical">技術面談</option>
                  <option value="trouble">相談・トラブル</option>
                  <option value="other">その他</option>
                </select>
              </label>

              <label className="form-field">
                <span>次回対応日</span>
                <input type="date" name="nextActionDate" />
              </label>

              <label className="form-field full">
                <span>面談内容</span>
                <textarea
                  name="summary"
                  rows={5}
                  placeholder="面談で話した内容、本人の状態、確認したことなど"
                  required
                />
              </label>

              <label className="form-field full">
                <span>次回アクション</span>
                <textarea
                  name="nextAction"
                  rows={4}
                  placeholder="次回までに確認すること、本人に伝えることなど"
                />
              </label>

              <label className="form-field full">
                <span>メモ</span>
                <textarea name="memo" rows={4} placeholder="補足事項" />
              </label>
            </div>

            <div className="form-actions">
              <Link
                className="btn ghost"
                href={`/employees/${employee.id}/edit?section=interviews`}
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