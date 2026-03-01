import {
  LitElement,
  html,
  css,
  unsafeCSS,
  PropertyValues,
  HTMLTemplateResult,
} from "lit";
import { customElement, state, property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { setBasePath } from "@shoelace-style/shoelace/dist/utilities/base-path.js";
import { db } from "@/service/TaskItDB";
import { formatDate, getThresholdDate, emit } from "@/service/utils";

import "@shoelace-style/shoelace/dist/themes/light.css";
import styles from "./ti-taskitem.lit.scss?inline";

setBasePath("/");
@customElement("ti-taskitem")
export class TiTaskItem extends LitElement {
  /**
   * スタイルシートを適用
   *
   * @static
   * @memberof TiTaskItem
   */
  static styles = css`
    ${unsafeCSS(styles)}
  `;

  /**
   * タスクを管理するID
   *
   * @type {number}
   * @memberof TiTaskItem
   */
  @property({ type: Number }) taskId?: number;

  /**
   * 期限日
   *
   * @type {Date}
   * @memberof TiTaskItem
   */
  @property({ type: Date }) dueDate?: Date;

  /**
   * ツールチップに表示するタスク名
   *
   * @type {string}
   * @memberof TiTaskItem
   */
  @state() private _title: string = "";

  /**
   * Creates an instance of TiTaskItem.
   * @memberof TiTaskItem
   */
  constructor() {
    super();
  }

  /**
   * コンポーネントがドキュメントの DOM に追加されたときに実行されます。
   *
   * @override
   * @memberof TiTaskItem
   */
  connectedCallback() {
    super.connectedCallback();
  }

  /**
   * コンポーネントがドキュメントの DOM から削除されたときに実行されます。
   *
   * @override
   * @memberof TiTaskItem
   */
  disconnectedCallback() {
    super.disconnectedCallback();
  }

  /**
   * render直前に実行されます。
   *
   * @protected
   * @param {PropertyValues} _changedProperties
   * @memberof TiTaskItem
   */
  protected willUpdate(_changedProperties: PropertyValues) {
    super.willUpdate(_changedProperties);
  }

  /**
   * スロットの内容が変更された場合に、その内容を取得します。
   *
   * @private
   * @param {Event} e
   * @memberof TiTaskItem
   */
  private _handleSlotChange(e: Event) {
    const slot = e.target as HTMLSlotElement;
    this._title = slot
      .assignedNodes({ flatten: true })
      .map((node) => node.textContent ?? "")
      .join("")
      .trim();
  }

  /**
   * コンポーネントのメインレイアウトをレンダリングします。
   * アプリケーションの基本構造を定義します。
   *
   * @protected
   * @override
   * @returns {HTMLTemplateResult} レンダリングされる Lit テンプレート
   * @memberof TiTaskItem
   */
  protected render(): HTMLTemplateResult {
    const isOverdue =
      !this.dueDate || new Date(this.dueDate) < getThresholdDate(3);
    const classes = {
      label: true, // 常に付与
      overdue: isOverdue,
    };

    return html`<div id="root">
      <sl-tooltip placement="right">
        <div class="${classMap(classes)}">
          <sl-icon
            library="taskit"
            name="${isOverdue ? "exclamation-square-fill" : "card-text"}"
            class="icon"
          ></sl-icon>
          <div class="task-title" @click=${this._handleClickTaskItem}>
            <slot @slotchange=${this._handleSlotChange}></slot>
          </div>
        </div>
        <div slot="content">
          ${this._title}<br />
          期限日:${formatDate(this.dueDate, "yyyy/MM/dd")}
        </div>
      </sl-tooltip>
      <sl-dropdown>
        <sl-icon-button
          library="taskit"
          name="chevron-right"
          class="icon"
          slot="trigger"
        ></sl-icon-button>
        <sl-menu>
          <sl-menu-item @click=${this._handleDeleteTask}>削除</sl-menu-item>
        </sl-menu>
      </sl-dropdown>
    </div>`;
  }

  /**
   * クリックされたタスクのIDを親コンポーネントに通知します。
   *
   * @private
   * @memberof TiTaskItem
   */
  private _handleClickTaskItem() {
    emit(this, "ti-taskitem-click", {
      detail: { taskId: this.taskId },
    });
  }

  /**
   * このタスクを削除します。
   *
   * @private
   * @return {*}  {Promise<void>}
   * @memberof TiTaskItem
   */
  private async _handleDeleteTask(): Promise<void> {
    if (!this.taskId) return;
    if (!confirm(`タスク「${this._title}」を削除しますか？`)) {
      return;
    }

    try {
      await db.task.delete(this.taskId);
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  }
}
