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
import { db } from "@/service/TaskItDB";
import { TASK_STATUS, type Task } from "@/models/Task";

import "@shoelace-style/shoelace/dist/themes/light.css";
import sharedStyles from "@assets/styles/shared.lit.scss?inline";
import styles from "./ti-task-data.lit.scss?inline";

setBasePath("/");
@customElement("ti-task-data")
export class TiTaskData extends LitElement {
  /**
   * スタイルシートを適用
   *
   * @static
   * @memberof TiTaskData
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
   * 対象とするタスクのID
   *
   * @type {number}
   * @memberof TiTaskData
   */
  @property({ type: Number }) taskId?: number;

  /**
   * タスクデータ
   * @type {Task | undefined}
   * @memberof TiTaskData
   */
  @state() private taskData?: Task;

  /**
   * Creates an instance of TiTaskData.
   * @memberof TiTaskData
   */
  constructor() {
    super();
  }

  /**
   * コンポーネントがドキュメントの DOM に追加されたときに実行されます。
   *
   * @override
   * @memberof TiTaskData
   */
  connectedCallback() {
    super.connectedCallback();
  }

  /**
   * コンポーネントがドキュメントの DOM から削除されたときに実行されます。
   *
   * @override
   * @memberof TiTaskData
   */
  disconnectedCallback() {
    super.disconnectedCallback();
  }

  /**
   * render直前に実行されます。
   *
   * @protected
   * @param {PropertyValues} _changedProperties
   * @memberof TiTaskData
   */
  protected async willUpdate(_changedProperties: PropertyValues) {
    super.willUpdate(_changedProperties);
    if (_changedProperties.has("taskId")) {
      if (this.taskId !== undefined) {
        this.taskData = await db.getTaskById(this.taskId);
      } else {
        this.taskData = undefined;
      }
    }
  }

  /**
   * コンポーネントのメインレイアウトをレンダリングします。
   * アプリケーションの基本構造を定義します。
   *
   * @protected
   * @override
   * @returns {HTMLTemplateResult} レンダリングされる Lit テンプレート
   * @memberof TiTaskData
   */
  protected render(): HTMLTemplateResult {
    if (!this.taskId) {
      return html``;
    }
    return html`<div class="container">
      <div class="title-area">
        <!--タイトル-->
        <sl-input
          id="title"
          placeholder="title..."
          size="small"
          value=${this.taskData?.title}
        ></sl-input>
      </div>
      <div class="control-area">
        <!--コントロールボタン-->
        <sl-button size="small" variant="primary">
          <sl-icon
            library="taskit"
            name="play-circle-fill"
            slot="prefix"
          ></sl-icon>
          開始
        </sl-button>
      </div>
      <div class="body-area scrollable">
        <!--期限日-->
        <div class="input-item">
          <div class="label">
            <sl-icon library="taskit" name="calendar"></sl-icon>
            <span>期限日</span>
          </div>
          <sl-input
            id="due-date"
            placeholder="due date..."
            size="small"
            type="date"
            value=${this.taskData?.dueDate}
          >
          </sl-input>
        </div>
        <!--説明-->
        <div class="input-item">
          <div class="label">
            <sl-icon library="taskit" name="chat-left-text"></sl-icon>
            <span>説明</span>
          </div>
          <sl-textarea
            id="description"
            size="small"
            resize="none"
            rows="5"
            placeholder="description..."
          ></sl-textarea>
        </div>
        <!--関係者-->
        <div class="input-item">
          <div class="label">
            <sl-icon library="taskit" name="people"></sl-icon>
            <span>関係者</span>
            <sl-tooltip content="Add">
              <sl-icon-button
                library="taskit"
                name="plus-square"
                @click=${this._handleClickAddMember}
              ></sl-icon-button>
            </sl-tooltip>
          </div>
          <div id="member" class="contents"></div>
        </div>
        <!--チェックリスト-->
        <div class="input-item">
          <div class="label">
            <sl-icon library="taskit" name="ui-checks-grid"></sl-icon>
            <span>チェックリスト</span>
            <sl-tooltip content="Add">
              <sl-icon-button
                library="taskit"
                name="plus-square"
              ></sl-icon-button>
            </sl-tooltip>
          </div>
          <div class="contents"></div>
        </div>
        <!--関連URL-->
        <div class="input-item">
          <div class="label">
            <sl-icon library="taskit" name="globe"></sl-icon>
            <span>関連URL</span>
            <sl-tooltip content="Add">
              <sl-icon-button
                library="taskit"
                name="plus-square"
              ></sl-icon-button>
            </sl-tooltip>
          </div>
          <div class="contents"></div>
        </div>
        <!--関連フォルダ-->
        <div class="input-item">
          <div class="label">
            <sl-icon library="taskit" name="folder"></sl-icon>
            <span>関連フォルダ</span>
            <sl-tooltip content="Add">
              <sl-icon-button
                library="taskit"
                name="plus-square"
              ></sl-icon-button>
            </sl-tooltip>
          </div>
          <div class="contents"></div>
        </div>
      </div>
    </div>`;
  }

  private _handleClickAddMember() {
    if (this.taskData && !this.taskData.members) {
      this.taskData.members = [];
    }
    this.taskData?.members.push({ div: "", name: "", tel: "" });
    this.requestUpdate();
  }
}
