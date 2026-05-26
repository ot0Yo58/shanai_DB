import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import {
  deleteCompanyEventHistory,
  deleteCytechProgress,
  deleteEmployee,
  deleteInterviewHistory,
  deletePrivateEvent,
  deleteTroubleHistory,
  getEmployeeById,
} from "@/lib/store";
import type {
  CompanyEventHistory,
  CompanyEventRole,
  CytechProgress,
  CytechStatus,
  InterviewCategory,
  InterviewHistory,
  PrivateEvent,
  PrivateEventCategory,
  TroubleHistory,
  TroubleStatus,
  TroubleType,
} from "@/types/employee";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

function displayValue(value: string | undefined): string {
  return value && value.trim() !== "" ? value : "-";
}

function labelFromMap<T extends string>(value: T, labels: Record<T, string>): string {
  return labels[value] ?? value;
}

const cytechStatusLabels: Record<CytechStatus, string> = {
  not_started: "未着手",
  in_progress: "進行中",
  completed: "完了",
  blocked: "詰まり中",
};

const interviewCategoryLabels: Record<InterviewCategory, string> = {
  regular: "定期面談",
  career: "キャリア面談",
  technical: "技術面談",
  trouble: "相談・トラブル",
  other: "その他",
};

const troubleTypeLabels: Record<TroubleType, string> = {
  inquiry: "問い合わせ",
  trouble: "トラブル",
  request: "依頼",
  other: "その他",
};

const troubleStatusLabels: Record<TroubleStatus, string> = {
  open: "未対応",
  in_progress: "対応中",
  resolved: "解決済み",
  watching: "経過観察",
};

const companyEventRoleLabels: Record<CompanyEventRole, string> = {
  participant: "参加",
  organizer: "運営",
  speaker: "登壇・発表",
  other: "その他",
};

const privateEventCategoryLabels: Record<PrivateEventCategory, string> = {
  family: "家族",
  health: "健康",
  life: "生活",
  career: "キャリア",
  other: "その他",
};

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

async function deleteInterviewHistoryAction(formData: FormData) {
  "use server";

  const employeeId = String(formData.get("employeeId") ?? "").trim();
  const interviewId = String(formData.get("interviewId") ?? "").trim();

  if (employeeId && interviewId) {
    await deleteInterviewHistory(employeeId, interviewId);
  }

  redirect(`/employees/${employeeId}`);
}

async function deleteTroubleHistoryAction(formData: FormData) {
  "use server";

  const employeeId = String(formData.get("employeeId") ?? "").trim();
  const troubleId = String(formData.get("troubleId") ?? "").trim();

  if (employeeId && troubleId) {
    await deleteTroubleHistory(employeeId, troubleId);
  }

  redirect(`/employees/${employeeId}`);
}

async function deleteCompanyEventHistoryAction(formData: FormData) {
  "use server";

  const employeeId = String(formData.get("employeeId") ?? "").trim();
  const eventId = String(formData.get("eventId") ?? "").trim();

  if (employeeId && eventId) {
    await deleteCompanyEventHistory(employeeId, eventId);
  }

  redirect(`/employees/${employeeId}`);
}

async function deletePrivateEventAction(formData: FormData) {
  "use server";

  const employeeId = String(formData.get("employeeId") ?? "").trim();
  const eventId = String(formData.get("eventId") ?? "").trim();

  if (employeeId && eventId) {
    await deletePrivateEvent(employeeId, eventId);
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

            <span className={`status-pill ${progress.status}`}>
              {labelFromMap(progress.status, cytechStatusLabels)}
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

function InterviewHistoryList({
  employeeId,
  interviewList,
}: {
  employeeId: string;
  interviewList: InterviewHistory[];
}) {
  if (interviewList.length === 0) {
    return <p className="empty-note">面談履歴はまだ登録されていません。</p>;
  }

  return (
    <div className="history-list">
      {interviewList.map((interview) => (
        <article className="history-card" key={interview.id}>
          <div className="history-card__head">
            <div>
              <p className="history-date">{interview.interviewDate}</p>
              <h4>{labelFromMap(interview.category, interviewCategoryLabels)}</h4>
            </div>

            <span className="history-badge">
              {displayValue(interview.interviewer)}
            </span>
          </div>

          <div className="history-body">
            <div>
              <span>面談内容</span>
              <p>{displayValue(interview.summary)}</p>
            </div>
            <div>
              <span>次回アクション</span>
              <p>{displayValue(interview.nextAction)}</p>
            </div>
            <div>
              <span>次回対応日</span>
              <p>{displayValue(interview.nextActionDate)}</p>
            </div>
            <div>
              <span>メモ</span>
              <p>{displayValue(interview.memo)}</p>
            </div>
          </div>

          <div className="progress-actions">
            <Link
              className="mini-btn ghost"
              href={`/employees/${employeeId}/interviews/${interview.id}/edit`}
            >
              編集
            </Link>

            <form action={deleteInterviewHistoryAction}>
              <input type="hidden" name="employeeId" value={employeeId} />
              <input type="hidden" name="interviewId" value={interview.id} />
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

function TroubleHistoryList({
  employeeId,
  troubleList,
}: {
  employeeId: string;
  troubleList: TroubleHistory[];
}) {
  if (troubleList.length === 0) {
    return (
      <p className="empty-note">
        問い合わせ・トラブル履歴はまだ登録されていません。
      </p>
    );
  }

  return (
    <div className="history-list">
      {troubleList.map((trouble) => (
        <article className="history-card" key={trouble.id}>
          <div className="history-card__head">
            <div>
              <p className="history-date">{trouble.occurredAt}</p>
              <h4>{trouble.subject}</h4>
            </div>

            <span className="history-badge">
              {labelFromMap(trouble.type, troubleTypeLabels)} /{" "}
              {labelFromMap(trouble.status, troubleStatusLabels)}
            </span>
          </div>

          <div className="history-body">
            <div>
              <span>内容</span>
              <p>{displayValue(trouble.detail)}</p>
            </div>
            <div>
              <span>対応内容</span>
              <p>{displayValue(trouble.action)}</p>
            </div>
            <div>
              <span>解決日</span>
              <p>{displayValue(trouble.resolvedAt)}</p>
            </div>
            <div>
              <span>メモ</span>
              <p>{displayValue(trouble.memo)}</p>
            </div>
          </div>

          <div className="progress-actions">
            <Link
              className="mini-btn ghost"
              href={`/employees/${employeeId}/troubles/${trouble.id}/edit`}
            >
              編集
            </Link>

            <form action={deleteTroubleHistoryAction}>
              <input type="hidden" name="employeeId" value={employeeId} />
              <input type="hidden" name="troubleId" value={trouble.id} />
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

function CompanyEventHistoryList({
  employeeId,
  eventList,
}: {
  employeeId: string;
  eventList: CompanyEventHistory[];
}) {
  if (eventList.length === 0) {
    return (
      <p className="empty-note">
        社内イベント参加履歴はまだ登録されていません。
      </p>
    );
  }

  return (
    <div className="history-list">
      {eventList.map((event) => (
        <article className="history-card" key={event.id}>
          <div className="history-card__head">
            <div>
              <p className="history-date">{event.eventDate}</p>
              <h4>{event.eventName}</h4>
            </div>

            <span className="history-badge">
              {labelFromMap(event.role, companyEventRoleLabels)}
            </span>
          </div>

          <div className="history-body">
            <div>
              <span>所感</span>
              <p>{displayValue(event.impression)}</p>
            </div>
            <div>
              <span>メモ</span>
              <p>{displayValue(event.memo)}</p>
            </div>
          </div>

          <div className="progress-actions">
            <Link
              className="mini-btn ghost"
              href={`/employees/${employeeId}/company-events/${event.id}/edit`}
            >
              編集
            </Link>

            <form action={deleteCompanyEventHistoryAction}>
              <input type="hidden" name="employeeId" value={employeeId} />
              <input type="hidden" name="eventId" value={event.id} />
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

function PrivateEventList({
  employeeId,
  eventList,
}: {
  employeeId: string;
  eventList: PrivateEvent[];
}) {
  if (eventList.length === 0) {
    return <p className="empty-note">プライベートイベントはまだ登録されていません。</p>;
  }

  return (
    <div className="history-list">
      {eventList.map((event) => (
        <article className="history-card" key={event.id}>
          <div className="history-card__head">
            <div>
              <p className="history-date">{event.eventDate}</p>
              <h4>{event.title}</h4>
            </div>

            <span className="history-badge">
              {labelFromMap(event.category, privateEventCategoryLabels)}
            </span>
          </div>

          <div className="history-body">
            <div>
              <span>内容</span>
              <p>{displayValue(event.detail)}</p>
            </div>
            <div>
              <span>メモ</span>
              <p>{displayValue(event.memo)}</p>
            </div>
          </div>

          <div className="progress-actions">
            <Link
              className="mini-btn ghost"
              href={`/employees/${employeeId}/private-events/${event.id}/edit`}
            >
              編集
            </Link>

            <form action={deletePrivateEventAction}>
              <input type="hidden" name="employeeId" value={employeeId} />
              <input type="hidden" name="eventId" value={event.id} />
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
          progressList={employee.cytechProgress ?? []}
        />
      ),
    },
    {
      title: "面談履歴",
      description: "面談日、内容、次回アクションなどを管理します。",
      addHref: `/employees/${employee.id}/interviews/new`,
      editHref: null,
      body: (
        <InterviewHistoryList
          employeeId={employee.id}
          interviewList={employee.interviewHistory ?? []}
        />
      ),
    },
    {
      title: "問い合わせ・トラブル履歴",
      description: "問い合わせ内容、対応状況、解決メモを管理します。",
      addHref: `/employees/${employee.id}/troubles/new`,
      editHref: null,
      body: (
        <TroubleHistoryList
          employeeId={employee.id}
          troubleList={employee.troubleHistory ?? []}
        />
      ),
    },
    {
      title: "社内イベント参加履歴",
      description: "社内イベントへの参加状況を管理します。",
      addHref: `/employees/${employee.id}/company-events/new`,
      editHref: null,
      body: (
        <CompanyEventHistoryList
          employeeId={employee.id}
          eventList={employee.companyEventHistory ?? []}
        />
      ),
    },
    {
      title: "プライベートイベント",
      description: "本人に関する任意の補足イベントを管理します。",
      addHref: `/employees/${employee.id}/private-events/new`,
      editHref: null,
      body: (
        <PrivateEventList
          employeeId={employee.id}
          eventList={employee.privateEvents ?? []}
        />
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
          {sections.map((section) => (
            <details className="accordion-card" key={section.title}>
              <summary className="accordion-summary">
                <span className="accordion-title">{section.title}</span>

                <span className="accordion-actions">
                  <span className="accordion-toggle-icon">＋</span>

                  {section.addHref ? (
                    <Link className="mini-btn" href={section.addHref}>
                      追加
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