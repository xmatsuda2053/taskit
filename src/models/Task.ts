import { Member } from "./Member";

export const TASK_STATUS = {
  PENDING: { code: "0", label: "未対応" },
  PROGRESS: { code: "5", label: "対応中" },
  DONE: { code: "9", label: "対応済" },
} as const;

type TaskStatusCode = (typeof TASK_STATUS)[keyof typeof TASK_STATUS]["code"];

export interface Task {
  id?: number;
  title: string;
  status: TaskStatusCode;
  dueDate?: Date;
  members: Member[];
  createdAt: Date;
  updatedAt: Date;
}
