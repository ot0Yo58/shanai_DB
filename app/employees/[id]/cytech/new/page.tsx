import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { addCytechProgress, getEmployeeById } from "@/lib/store";
import type { CytechStatus } from "@/types/employee";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

function getFormValue(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

function getStatusValue(value: string): CytechStatus {
  const allowed: CytechStatus[] = [
    "not_started",
    "in_progress",
    "completed",
    "blocked",
  ];

  return allowed.includes(value as CytechStatus)
    ? (value as CytechStatus)
    : "not_started";
}

async function createCytechProgressAction(employeeId: string, formData: FormData) {
  "use server";

  await addCytechProgress(employeeId, {
    step: getFormValue(formData, "step"),
    title: getFormValue(formData, "title"),
    status: getStatusValue(getFormValue(formData, "status")),
    startedAt: getFormValue(formData, "startedAt"),
    completedAt: getFormValue(formData, "completedAt"),
    memo: getFormValue(formData, "memo"),
  });

  redirect(`/employees/${employeeId}`);
}

export default async function NewCytechProgressPage({ params }: PageProps) {
  const { id } = await params;
  const employee = await getEmployeeById(id);

  if (!employee) {
    notFound();
  }

  const action = createCytechProgressAction.bind(null, employee.id);

  return (
    <>
      <header className="app-header">
        <div className="app-header__inner">
          <Link className="brand-link" href="/">
            <h1>社員カルテDB</h1>
            <p>Employee Profile Database</p>
          </Link>

          <div className="app-header__badge">Cytech Progress</div>
        </div>
      </header>

      <main className="container">
        <section className="page-head">
          <div>
            <p className="eyebrow">Add Cytech Progress</p>
            <h2>Cytech進捗追加</h2>
            <p className="sub-text">{employee.name} さんのCytech進捗を追加します。</p>
          </div>

          <Link className="btn ghost" href={`/employees/${employee.id}`}>
            詳細へ戻る
          </Link>
        </section>

        <section className="card">
          <form className="employee-form" action={action}>
            <div className="form-grid">
              <label className="form-field">
                <span>STEP</span>
                <input
                  type="text"
                  name="step"
                  placeholder="例：STEP 10"
                  required
                />
              </label>

              <label className="form-field">
                <span>タイトル</span>
                <input
                  type="text"
                  name="title"
                  placeholder="例：Laravel ECサイト実装"
                />
              </label>

              <label className="form-field">
                <span>ステータス</span>
                <select name="status" defaultValue="not_started">
                  <option value="not_started">未着手</option>
                  <option value="in_progress">進行中</option>
                  <option value="completed">完了</option>
                  <option value="blocked">詰まり中</option>
                </select>
              </label>

              <label className="form-field">
                <span>開始日</span>
                <input type="date" name="startedAt" />
              </label>

              <label className="form-field">
                <span>完了日</span>
                <input type="date" name="completedAt" />
              </label>

              <label className="form-field full">
                <span>メモ</span>
                <textarea
                  name="memo"
                  rows={5}
                  placeholder="詰まっている内容、理解度、次に見るべき点など"
                />
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