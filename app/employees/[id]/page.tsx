import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { Breadcrumbs } from "@/components/Breadcrumbs";

import { getEmployeeById } from "@/lib/store";
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

type DetailSection = {
  id:
    | "basic"
    | "cytech"
    | "interviews"
    | "troubles"
    | "company-events"
    | "private-events";
  title: string;
  description: string;
  editHref: string;
  body: ReactNode;
};

function displayValue(value: string | undefined): string {
  return value && value.trim() !== "" ? value : "-";
}

function labelFromMap<T extends string>(
  value: T,
  labels: Record<T, string>,
): string {
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

function CytechProgressList({
  progressList,
}: {
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
        </article>
      ))}
    </div>
  );
}

function InterviewHistoryList({
  interviewList,
}: {
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
        </article>
      ))}
    </div>
  );
}

function TroubleHistoryList({
  troubleList,
}: {
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
        </article>
      ))}
    </div>
  );
}

function CompanyEventHistoryList({
  eventList,
}: {
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
        </article>
      ))}
    </div>
  );
}

function PrivateEventList({
  eventList,
}: {
  eventList: PrivateEvent[];
}) {
  if (eventList.length === 0) {
    return (
      <p className="empty-note">
        プライベートイベントはまだ登録されていません。
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

  const sections: DetailSection[] = [
    {
      id: "basic",
      title: "基本情報",
      description: "社員の基本プロフィールを確認できます。",
      editHref: `/employees/${employee.id}/edit?section=basic`,
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
      id: "cytech",
      title: "Cytech進捗",
      description: "Cytechの学習状況・詰まっている箇所・完了日を確認できます。",
      editHref: `/employees/${employee.id}/edit?section=cytech`,
      body: <CytechProgressList progressList={employee.cytechProgress ?? []} />,
    },
    {
      id: "interviews",
      title: "面談履歴",
      description: "面談日、内容、次回アクションなどを確認できます。",
      editHref: `/employees/${employee.id}/edit?section=interviews`,
      body: (
        <InterviewHistoryList
          interviewList={employee.interviewHistory ?? []}
        />
      ),
    },
    {
      id: "troubles",
      title: "問い合わせ・トラブル履歴",
      description: "問い合わせ内容、対応状況、解決メモを確認できます。",
      editHref: `/employees/${employee.id}/edit?section=troubles`,
      body: (
        <TroubleHistoryList troubleList={employee.troubleHistory ?? []} />
      ),
    },
    {
      id: "company-events",
      title: "社内イベント参加履歴",
      description: "社内イベントへの参加状況を確認できます。",
      editHref: `/employees/${employee.id}/edit?section=company-events`,
      body: (
        <CompanyEventHistoryList
          eventList={employee.companyEventHistory ?? []}
        />
      ),
    },
    {
      id: "private-events",
      title: "プライベートイベント",
      description: "本人に関する任意の補足イベントを確認できます。",
      editHref: `/employees/${employee.id}/edit?section=private-events`,
      body: <PrivateEventList eventList={employee.privateEvents ?? []} />,
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
        <Breadcrumbs
  items={[
    { label: "社員一覧", href: "/" },
    { label: employee.name },
  ]}
/>
        <section className="detail-hero employee-page-hero">
          <div>
            <p className="eyebrow">Employee Detail</p>
            <div className="page-title-row">
              <h2>{employee.name}</h2>
              <span className="page-mode-badge">詳細画面</span>
            </div>
            <p className="sub-text">
              {displayValue(employee.employeeCode)} /{" "}
              {displayValue(employee.nameKana)}
            </p>
          </div>

          <div className="page-actions">
            <Link className="btn ghost" href="/">
              一覧へ戻る
            </Link>

            <Link
              className="btn primary"
              href={`/employees/${employee.id}/edit?section=basic`}
            >
              編集画面へ
            </Link>
          </div>
        </section>

        <section className="accordion-list">
          {sections.map((section, index) => (
            <details
              className="accordion-card"
              key={section.id}
              open={index === 0}
            >
              <summary className="accordion-summary">
                <span className="accordion-title">{section.title}</span>

                <span className="accordion-actions">
                  <span className="accordion-toggle-icon">＋</span>

                  <Link className="mini-btn ghost" href={section.editHref}>
                    編集
                  </Link>
                </span>
              </summary>

              <div className="accordion-body">
                <p className="section-help">{section.description}</p>
                {section.body}
              </div>
            </details>
          ))}
        </section>
      </main>
    </>
  );
}