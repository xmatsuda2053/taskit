import {
  LitElement,
  html,
  css,
  unsafeCSS,
  PropertyValues,
  HTMLTemplateResult,
} from "lit";
import { repeat } from "lit/directives/repeat.js";
import { customElement, state, property, query } from "lit/decorators.js";
import { setBasePath } from "@shoelace-style/shoelace/dist/utilities/base-path.js";
import { db } from "@/service/TaskItDB";
import { TASK_STATUS, type Task } from "@/models/Task";

import { liveQuery, Subscription } from "dexie";

import "@shoelace-style/shoelace/dist/themes/light.css";
import sharedStyles from "@assets/styles/shared.lit.scss?inline";
import styles from "./ti-tasklist.lit.scss?inline";
import type { SlDialog, SlInput } from "@shoelace-style/shoelace";

setBasePath("/");
@customElement("ti-tasklist")
export class TiTaskList extends LitElement {
  /**
   * スタイルシートを適用
   *
   * @static
   * @memberof TiTaskList
   */
  static styles = [
    css`
      ${unsafeCSS(sharedStyles)}
    `,
    css`
      ${unsafeCSS(styles)}
    `,
  ];

  /**
   * タスク名入力ダイアログ
   *
   * @type {SlDialog}
   * @memberof TiTaskList
   */
  @query("#add-task-dialog") addTaskDialog!: SlDialog;

  /**
   * タスク名入力欄
   *
   * @type {SlInput}
   * @memberof TiTaskList
   */
  @query("#new-task-title") newTaskTitleInput!: SlInput;

  /**
   * 未実行のタスク一覧
   *
   * @private
   * @type {Task[]}
   * @memberof TiTaskList
   */
  @state() private _pendingTasks: Task[] = [];

  /**
   * 実行中のタスク一覧
   *
   * @private
   * @type {Task[]}
   * @memberof TiTaskList
   */
  @state() private _progressTasks: Task[] = [];

  /**
   * 完了のタスク一覧
   *
   * @private
   * @type {Task[]}
   * @memberof TiTaskList
   */
  @state() private _doneTasks: Task[] = [];

  /**
   * Taskの変更を検知する
   *
   * @private
   * @type {Subscription}
   * @memberof TiTaskList
   */
  private _dbSubscription?: Subscription;

  /**
   * Creates an instance of TiTaskList.
   * @memberof TiTaskList
   */
  constructor() {
    super();
  }

  /**
   * コンポーネントがドキュメントの DOM に追加されたときに実行されます。
   *
   * @override
   * @memberof TiTaskList
   */
  connectedCallback() {
    super.connectedCallback();
    this._subscribeToTasks();
  }

  /**
   * コンポーネントがドキュメントの DOM から削除されたときに実行されます。
   *
   * @override
   * @memberof TiTaskList
   */
  disconnectedCallback() {
    super.disconnectedCallback();
    this._dbSubscription?.unsubscribe();
  }

  /**
   * render直前に実行されます。
   *
   * @protected
   * @param {PropertyValues} _changedProperties
   * @memberof TiTaskList
   */
  protected willUpdate(_changedProperties: PropertyValues) {
    super.willUpdate(_changedProperties);
  }

  /**
   * コンポーネントのメインレイアウトをレンダリングします。
   * アプリケーションの基本構造を定義します。
   *
   * @protected
   * @override
   * @returns {HTMLTemplateResult} レンダリングされる Lit テンプレート
   * @memberof TiTaskList
   */
  protected render(): HTMLTemplateResult {
    return html` <div id="root">
      <sl-tab-group>
        <sl-tab slot="nav" panel="pending">
          <sl-icon library="fillgo" name="square"></sl-icon>
          <span>未対応</span>
        </sl-tab>
        <sl-tab slot="nav" panel="progress">
          <sl-icon library="fillgo" name="square-half"></sl-icon>
          <span>対応中</span>
        </sl-tab>
        <sl-tab slot="nav" panel="done">
          <sl-icon library="fillgo" name="check-square"></sl-icon>
          <span>対応済</span>
        </sl-tab>

        <sl-tab-panel name="pending">
          <div class="task-list scrollable">
            ${repeat(
              this._pendingTasks,
              (task) => task.id,
              (task) => html`
                <ti-taskitem .taskId=${task.id} .dueDate=${task.dueDate}>
                  ${task.title}
                </ti-taskitem>
              `,
            )}
          </div>
        </sl-tab-panel>
        <sl-tab-panel name="progress">
          <div class="task-list scrollable">
            ${repeat(
              this._progressTasks,
              (task) => task.id,
              (task) => html`
                <ti-taskitem .task=${task}>${task.title}</ti-taskitem>
              `,
            )}
          </div>
        </sl-tab-panel>
        <sl-tab-panel name="done">
          <div class="task-list scrollable">
            ${repeat(
              this._doneTasks,
              (task) => task.id,
              (task) => html`
                <ti-taskitem .task=${task}>${task.title}</ti-taskitem>
              `,
            )}
          </div>
        </sl-tab-panel>
      </sl-tab-group>
      <div class="button-area">
        <sl-tooltip content="Add Task" placement="top">
          <sl-button
            variant="primary"
            id="add-task-button"
            @click=${() => this.addTaskDialog.show()}
          >
            <sl-icon library="fillgo" name="journal-plus"></sl-icon>
          </sl-button>
        </sl-tooltip>
        <sl-dialog
          id="add-task-dialog"
          label="新規タスクを追加"
          @sl-request-close=${this._handleRequestClose}
        >
          <div class="dialog-content">
            <sl-input placeholder="タスク名" id="new-task-title">
              <sl-icon
                library="fillgo"
                name="card-text"
                slot="prefix"
              >
            </sl-input>
          </div>
          <sl-button slot="footer" variant="primary" id="save-task-button" @click=${this._addTask}>
            <sl-icon library="fillgo" name="floppy"></sl-icon>
          </sl-button>
        </sl-dialog>
      </div>
    </div>`;
  }

  /**
   * 閉じるリクエストを処理し、ドキュメント内のアクティブなフォーカスを解除します。
   *
   * @private
   * @returns {void}
   */
  private _handleRequestClose(): void {
    this.newTaskTitleInput.value = "";
    (document.activeElement as HTMLElement)?.blur();
  }

  /**
   * 新しいタスクをデータベースに追加し、入力欄をリセットしてダイアログを閉じます。
   * @description
   * 入力フィールド（`newTaskTitleInput`）からタイトルを取得し、バリデーションを行った後、
   * IndexedDBに保存します。保存成功後、入力欄をクリアしてダイアログを非表示にします。
   * @private
   * @async
   * @returns {Promise<void>}
   * @memberof TiTaskItem
   */
  private async _addTask(): Promise<void> {
    const title = this.newTaskTitleInput.value?.trim();
    if (!title) {
      return;
    }

    try {
      await db.addTask(title);
      this._handleRequestClose();
      this.addTaskDialog.hide();
    } catch (error) {
      console.error("Failed Add Task:", error);
    }
  }

  /**
   * タスクの変更を検知して、最新のタスクデータを取得する。
   *
   * @private
   * @memberof TiTaskList
   */
  private _subscribeToTasks(): void {
    const observable = liveQuery(() => db.task.toArray());
    this._dbSubscription = observable.subscribe({
      next: (tasks) => {
        this._pendingTasks = tasks.filter(
          (t) => t.status === TASK_STATUS.PENDING,
        );
        this._progressTasks = tasks.filter(
          (t) => t.status === TASK_STATUS.PROGRESS,
        );
        this._doneTasks = tasks.filter((t) => t.status === TASK_STATUS.DONE);
      },
      error: (err) => console.error("LiveQuery Error:", err),
    });
  }
}
