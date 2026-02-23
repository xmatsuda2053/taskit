import { Member } from "./Member";
import { CB } from "./CB";
import { Link } from "./Link";

export const TASK_STATUS = {
  PENDING: { code: "0", label: "未対応" },
  PROGRESS: { code: "5", label: "対応中" },
  DONE: { code: "9", label: "対応済" },
} as const;

type TaskStatusCode = (typeof TASK_STATUS)[keyof typeof TASK_STATUS]["code"];

export interface Task {
  id?: number;
  status: TaskStatusCode;
  title: string;
  description: string;
  dueDate?: Date;
  members: Member[];
  checkboxes: CB[];
  urls: Link[];
  folders: Link[];
  createdAt: Date;
  updatedAt: Date;
}
