import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import {
  deleteCytechProgress,
  deleteEmployee,
  getEmployeeById,
} from "@/lib/store";
import type { CytechProgress, CytechStatus } from "@/types/employee";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

function displayValue(value: string | undefined): string {
  return value && value.trim() !== "" ? value : "-";
}

function getStatusLabel(status: CytechStatus): string {
  const labels: Record<CytechStatus, string> = {
    not_started: "未着手",
    in_progress: "進行中",
    completed: "完了",
    blocked: "詰まり中",
  };

  return labels[status];
}

function getStatusClass(status: CytechStatus): string {
  return `status-pill ${status}`;
}

async function deleteEmployeeAction(formData: FormData) {
  "use server";

  const id = String(formData.get("id") ?? "").trim();

  if (id) {
    await deleteEmployee(id);
  }

  redirect("/");
}

async function deleteCytechProgressAction(formData: FormData) {
  "use server";

  const employeeId = String(formData.get("employeeId") ?? "").trim();
  const progressId = String(formData.get("progressId") ?? "").trim();

  if (employeeId && progressId) {
    await deleteCytechProgress(employeeId, progressId);
  }

  redirect(`/employees/${employeeId}`);
}

function CytechProgressList({
  employeeId,
  progressList,
}: {
  employeeId: string;
  progressList: CytechProgress[];
}) {
  if (progressList.length === 0) {
    return <p className="empty-note">Cytech進捗はまだ登録されていません。</p>;
  }

  return (
    <div className="progress-list">
      {progressList.map((progress) => (
        <article className="progress-card" key={progress.id}>
          <div className="progress-card__head">
            <div>
              <p className="progress-step">{progress.step}</p>
              <h4>{displayValue(progress.title)}</h4>
            </div>

            <span className={getStatusClass(progress.status)}>
              {getStatusLabel(progress.status)}
            </span>
          </div>

          <div className="progress-meta">
            <span>開始日：{displayValue(progress.startedAt)}</span>
            <span>完了日：{displayValue(progress.completedAt)}</span>
          </div>

          <p className="progress-memo">{displayValue(progress.memo)}</p>

          <div className="progress-actions">
            <Link
              className="mini-btn ghost"
              href={`/employees/${employeeId}/cytech/${progress.id}/edit`}
            >
              編集
            </Link>

            <form action={deleteCytechProgressAction}>
              <input type="hidden" name="employeeId" value={employeeId} />
              <input type="hidden" name="progressId" value={progress.id} />
              <button className="mini-btn danger-mini" type="submit">
                削除
              </button>
            </form>
          </div>
        </article>
      ))}
    </div>
  );
}

export default async function EmployeeDetailPage({ params }: PageProps) {
  const { id } = await params;
  const employee = await getEmployeeById(id);

  if (!employee) {
    notFound();
  }

  const cytechProgress = employee.cytechProgress ?? [];

  const sections = [
    {
      title: "基本情報",
      description: "社員の基本プロフィールを確認できます。",
      addHref: null,
      editHref: `/employees/${employee.id}/edit`,
      body: (
        <div className="profile-grid">
          <div className="profile-item">
            <span>ID</span>
            <strong>{displayValue(employee.id)}</strong>
          </div>

          <div className="profile-item">
            <span>社員番号</span>
            <strong>{displayValue(employee.employeeCode)}</strong>
          </div>

          <div className="profile-item">
            <span>氏名</span>
            <strong>{displayValue(employee.name)}</strong>
          </div>

          <div className="profile-item">
            <span>カナ</span>
            <strong>{displayValue(employee.nameKana)}</strong>
          </div>

          <div className="profile-item">
            <span>生年月日</span>
            <strong>{displayValue(employee.birthday)}</strong>
          </div>

          <div className="profile-item">
            <span>入社日</span>
            <strong>{displayValue(employee.joinDate)}</strong>
          </div>

          <div className="profile-item">
            <span>通勤方法</span>
            <strong>{displayValue(employee.commuteMethod)}</strong>
          </div>

          <div className="profile-item full">
            <span>住所</span>
            <strong>{displayValue(employee.address)}</strong>
          </div>

          <div className="profile-item full">
            <span>将来像</span>
            <strong>{displayValue(employee.futureVision)}</strong>
          </div>

          <div className="profile-item full">
            <span>メモ</span>
            <strong>{displayValue(employee.memo)}</strong>
          </div>
        </div>
      ),
    },
    {
      title: "Cytech進捗",
      description: "Cytechの学習状況・詰まっている箇所・完了日を管理します。",
      addHref: `/employees/${employee.id}/cytech/new`,
      editHref: null,
      body: (
        <CytechProgressList
          employeeId={employee.id}
          progressList={cytechProgress}
        />
      ),
    },
    {
      title: "面談履歴",
      description: "面談日、内容、次回アクションなどを管理します。",
      addHref: "#",
      editHref: "#",
      body: <p className="empty-note">面談履歴はまだ登録されていません。</p>,
    },
    {
      title: "問い合わせ・トラブル履歴",
      description: "問い合わせ内容、対応状況、解決メモを管理します。",
      addHref: "#",
      editHref: "#",
      body: (
        <p className="empty-note">
          問い合わせ・トラブル履歴はまだ登録されていません。
        </p>
      ),
    },
    {
      title: "社内イベント参加履歴",
      description: "社内イベントへの参加状況を管理します。",
      addHref: "#",
      editHref: "#",
      body: (
        <p className="empty-note">
          社内イベント参加履歴はまだ登録されていません。
        </p>
      ),
    },
    {
      title: "プライベートイベント",
      description: "本人に関する任意の補足イベントを管理します。",
      addHref: "#",
      editHref: "#",
      body: (
        <p className="empty-note">
          プライベートイベントはまだ登録されていません。
        </p>
      ),
    },
  ];

  return (
    <>
      <header className="app-header">
        <div className="app-header__inner">
          <Link className="brand-link" href="/">
            <h1>社員カルテDB</h1>
            <p>Employee Profile Database</p>
          </Link>

          <div className="app-header__badge">Employee Detail</div>
        </div>
      </header>

      <main className="container">
        <section className="detail-hero">
          <div>
            <p className="eyebrow">Employee Detail</p>
            <h2>{employee.name}</h2>
            <p className="sub-text">
              {displayValue(employee.employeeCode)} /{" "}
              {displayValue(employee.nameKana)}
            </p>
          </div>

          <div className="page-actions">
            <Link className="btn ghost" href="/">
              一覧へ戻る
            </Link>

            <Link className="btn primary" href={`/employees/${employee.id}/edit`}>
              編集画面へ
            </Link>
          </div>
        </section>

        <section className="accordion-list">
          {sections.map((section, index) => (
            <details
              className="accordion-card"
              key={section.title}
              open={index <= 1}
            >
              <summary className="accordion-summary">
                <span className="accordion-title">{section.title}</span>

                <span className="accordion-actions">
                  {section.addHref ? (
                    <Link className="mini-btn" href={section.addHref}>
                      ＋追加
                    </Link>
                  ) : null}

                  {section.editHref ? (
                    <Link className="mini-btn ghost" href={section.editHref}>
                      編集
                    </Link>
                  ) : null}
                </span>
              </summary>

              <div className="accordion-body">
                <p className="section-help">{section.description}</p>
                {section.body}
              </div>
            </details>
          ))}
        </section>

        <section className="card danger-zone">
          <div>
            <h3>削除</h3>
            <p className="section-help">
              この社員データを削除します。削除すると一覧から表示されなくなります。
            </p>
          </div>

          <form action={deleteEmployeeAction}>
            <input type="hidden" name="id" value={employee.id} />
            <button className="btn danger" type="submit">
              この社員を削除する
            </button>
          </form>
        </section>
      </main>
    </>
  );
}