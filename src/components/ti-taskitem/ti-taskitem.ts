import {
  LitElement,
  html,
  css,
  unsafeCSS,
  PropertyValues,
  HTMLTemplateResult,
} from "lit";
import { customElement, state, property, query } from "lit/decorators.js";
import { setBasePath } from "@shoelace-style/shoelace/dist/utilities/base-path.js";
import { type Task } from "@/models/Task";
import { db } from "@/service/TaskItDB";

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
   * タスオブジェクトト
   *
   * @type {Task}
   * @memberof TiTaskItem
   */
  @property({ type: Object }) task?: Task;

  /**
   * ツールチップに表示するタスク名
   *
   * @type {string}
   * @memberof TiTaskItem
   */
  @state() tooltipContent: string = "";

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
  private handleSlotChange(e: Event) {
    const slot = e.target as HTMLSlotElement;
    this.tooltipContent = slot
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
    return html`<div id="root">
      <sl-tooltip content="${this.tooltipContent}" placement="right">
        <div class="label">
          <slot @slotchange=${this.handleSlotChange}></slot>
        </div>
      </sl-tooltip>
      <sl-dropdown>
        <sl-icon-button
          library="fillgo"
          name="chevron-right"
          class="icon"
          slot="trigger"
        ></sl-icon-button>
        <sl-menu>
          <sl-menu-item @click=${this._deleteTask}>削除</sl-menu-item>
        </sl-menu>
      </sl-dropdown>
    </div>`;
  }

  /**
   * このタスクを削除します。
   *
   * @private
   * @return {*}  {Promise<void>}
   * @memberof TiTaskItem
   */
  private async _deleteTask(): Promise<void> {
    if (!this.task?.id) return;
    if (!confirm(`タスク「${this.task.title}」を削除しますか？`)) {
      return;
    }

    try {
      await db.task.delete(this.task.id);
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  }
}
