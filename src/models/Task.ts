export const TASK_STATUS = {
  PENDING: "pending",
  PROGRESS: "progress",
  DONE: "done",
} as const;

export type TaskStatus = (typeof TASK_STATUS)[keyof typeof TASK_STATUS];

export interface Task {
  id?: number;
  title: string;
  status: TaskStatus;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}
