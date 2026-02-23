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
      status: TASK_STATUS.PENDING.code, // デフォルトは '0'（未対応）
      members: [],
      checkboxes: [],
      dueDate: undefined,
      createdAt: now,
      updatedAt: now,
    };

    return await this.task.add(newTask);
  }

  /**
   * タスクをIDで取得します。
   * @param id タスクID
   * @returns 取得されたタスク、存在しない場合はundefined
   */
  async getTaskById(id: number): Promise<Task | undefined> {
    return await this.task.get(id);
  }

  /**
   * タスクの内容を更新します。
   *
   * @param {Task} updatedTask
   * @return {*}  {Promise<void>}
   * @memberof TaskItDB
   */
  async updateTask(updatedTask: Task): Promise<void> {
    updatedTask.updatedAt = new Date();
    await this.task.put(updatedTask);
  }
}
export const db = new TaskItDB();
