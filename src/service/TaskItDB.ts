import Dexie, { Table } from "dexie";
import { TASK_STATUS, type Task } from "@/models/Task";

export class TaskItDB extends Dexie {
  task!: Table<Task>;

  /**
   * Creates an instance of TaskItDB.
   * @memberof TaskItDB
   */
  constructor() {
    super("TaskItDB");
    this.version(1).stores({
      task: "++id, title, status, createdAt",
    });
  }

  /**
   * 新しいタスクを追加します。
   * @param title タスク名
   * @returns 追加されたタスクのID
   */
  async addTask(title: string): Promise<number> {
    const now = new Date();

    // Task インターフェースに基づいたオブジェクトを作成
    const newTask: Task = {
      title: title,
      status: TASK_STATUS.PENDING, // デフォルトは 'pending'
      createdAt: now,
      updatedAt: now,
    };

    return await this.task.add(newTask);
  }
}
export const db = new TaskItDB();
