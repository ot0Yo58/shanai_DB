export type CytechStatus =
  | "not_started"
  | "in_progress"
  | "completed"
  | "blocked";

export type CytechProgress = {
  id: string;
  step: string;
  title?: string;
  status: CytechStatus;
  startedAt?: string;
  completedAt?: string;
  memo?: string;
  createdAt: string;
  updatedAt: string;
};

export type InterviewCategory =
  | "regular"
  | "career"
  | "technical"
  | "trouble"
  | "other";

export type InterviewHistory = {
  id: string;
  interviewDate: string;
  interviewer?: string;
  category: InterviewCategory;
  summary: string;
  nextAction?: string;
  nextActionDate?: string;
  memo?: string;
  createdAt: string;
  updatedAt: string;
};

export type TroubleType = "inquiry" | "trouble" | "request" | "other";

export type TroubleStatus =
  | "open"
  | "in_progress"
  | "resolved"
  | "watching";

export type TroubleHistory = {
  id: string;
  occurredAt: string;
  type: TroubleType;
  status: TroubleStatus;
  subject: string;
  detail?: string;
  action?: string;
  resolvedAt?: string;
  memo?: string;
  createdAt: string;
  updatedAt: string;
};

export type CompanyEventRole =
  | "participant"
  | "organizer"
  | "speaker"
  | "other";

export type CompanyEventHistory = {
  id: string;
  eventDate: string;
  eventName: string;
  role: CompanyEventRole;
  impression?: string;
  memo?: string;
  createdAt: string;
  updatedAt: string;
};

export type PrivateEventCategory =
  | "family"
  | "health"
  | "life"
  | "career"
  | "other";

export type PrivateEvent = {
  id: string;
  eventDate: string;
  category: PrivateEventCategory;
  title: string;
  detail?: string;
  memo?: string;
  createdAt: string;
  updatedAt: string;
};

export type Employee = {
  id: string;
  employeeCode?: string;
  name: string;
  nameKana?: string;
  birthday?: string;
  address?: string;
  joinDate?: string;
  commuteMethod?: string;
  futureVision?: string;
  memo?: string;
  cytechProgress?: CytechProgress[];
  interviewHistory?: InterviewHistory[];
  troubleHistory?: TroubleHistory[];
  companyEventHistory?: CompanyEventHistory[];
  privateEvents?: PrivateEvent[];
  createdAt: string;
  updatedAt: string;
};