import {
  LitElement,
  html,
  nothing,
  css,
  unsafeCSS,
  PropertyValues,
  HTMLTemplateResult,
} from "lit";
import { customElement, state, property, query } from "lit/decorators.js";
import { setBasePath } from "@shoelace-style/shoelace/dist/utilities/base-path.js";
import { db } from "@/service/TaskItDB";
import { TASK_STATUS, type Task } from "@/models/Task";
import { formatDate } from "@/service/utils";

import "@shoelace-style/shoelace/dist/themes/light.css";
import sharedStyles from "@assets/styles/shared.lit.scss?inline";
import styles from "./ti-task-data.lit.scss?inline";
import { SlInput, SlTextarea } from "@shoelace-style/shoelace";

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
   * 説明欄が拡大表示モード化同化を管理するフラグ
   *
   * @private
   * @type {boolean}
   * @memberof TiTaskData
   */
  @state() private isDescriptionExpandMode: boolean = false;

  /**
   * 関係者が編集モードかどうかを管理するフラグ
   * @type {boolean}
   * @memberof TiTaskData
   */
  @state() private isMemberEditMode: boolean = false;

  /**
   * チェックボックスが編集モードかどうかを管理するフラグ
   *
   * @private
   * @type {boolean}
   * @memberof TiTaskData
   */
  @state() private isCheckBoxEditMode: boolean = false;

  /**
   * URLが編集モードかどうかを管理するフラグ
   *
   * @private
   * @type {boolean}
   * @memberof TiTaskData
   */
  @state() private isUrlEditMode: boolean = false;

  /**
   * フォルダが編集モードかどうかを管理するフラグ
   *
   * @private
   * @type {boolean}
   * @memberof TiTaskData
   */
  @state() private isFolderEditMode: boolean = false;

  /**
   *タイトル入力フィールドの参照を取得するためのクエリデコレーター
   *
   * @private
   * @type {SlInput}
   * @memberof TiTaskData
   */
  @query("#title") private titleInput!: SlInput;

  /**
   * 期限日入力フィールドの参照を取得するためのクエリデコレーター
   *
   * @private
   * @type {SlInput}
   * @memberof TiTaskData
   */
  @query("#due-date") private dueDateInput!: SlInput;

  /**
   * 説明入力フィールドの参照を取得するためのクエリデコレーター
   *
   * @private
   * @type {SlTextarea}
   * @memberof TiTaskData
   * */
  @query("#description") private descriptionInput!: SlTextarea;

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
          @sl-change=${this._handleChangeTitle}
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
            value=${formatDate(this.taskData?.dueDate, "yyyy-MM-dd")}
            @sl-change=${this._handleChangeDueDate}
          >
          </sl-input>
        </div>
        <!--説明-->
        <div class="input-item">
          <div class="label">
            <sl-icon library="taskit" name="chat-left-text"></sl-icon>
            <span>説明</span>
            <div class="button-area">
              <sl-tooltip
                content="${this.isDescriptionExpandMode
                  ? "Contract"
                  : "Expand"}"
              >
                <sl-icon-button
                  library="taskit"
                  name="${this.isDescriptionExpandMode
                    ? "chevron-bar-contract"
                    : "chevron-bar-expand"}"
                  @click=${() => {
                    this.isDescriptionExpandMode =
                      !this.isDescriptionExpandMode;
                  }}
                ></sl-icon-button>
              </sl-tooltip>
            </div>
          </div>
          <sl-textarea
            id="description"
            size="small"
            resize="none"
            rows=${this.isDescriptionExpandMode ? nothing : "2"}
            resize=${this.isDescriptionExpandMode ? "auto" : "none"}
            placeholder="description..."
            value=${this.taskData?.description}
            @sl-change=${this._handleChangeDescription}
          ></sl-textarea>
        </div>
        <!--関係者-->
        <div class="input-item">
          <div class="label">
            <sl-icon library="taskit" name="people"></sl-icon>
            <span>関係者</span>
            <div class="button-area">
              <sl-tooltip content="Add">
                <sl-icon-button
                  library="taskit"
                  name="plus-lg"
                  @click=${this._handleClickAddMember}
                ></sl-icon-button>
              </sl-tooltip>
              <sl-tooltip content="Edit">
                <sl-icon-button
                  library="taskit"
                  name="pencil-square"
                  class=${this.isMemberEditMode ? "active" : ""}
                  @click=${this._handleClickEditMember}
                ></sl-icon-button>
              </sl-tooltip>
            </div>
          </div>
          <div id="member" class="contents">
            <ti-members
              .isEditMode=${this.isMemberEditMode}
              .members=${this.taskData?.members || []}
              @ti-change-members=${this._handleChangeMembers}
            ></ti-members>
          </div>
        </div>
        <!--チェックリスト-->
        <div class="input-item">
          <div class="label">
            <sl-icon library="taskit" name="ui-checks-grid"></sl-icon>
            <span>チェックリスト</span>
            <div class="button-area">
              <sl-tooltip content="Edit">
                <sl-icon-button
                  library="taskit"
                  name="pencil-square"
                  class=${this.isCheckBoxEditMode ? "active" : ""}
                  @click=${this._handleClickEditCheckBox}
                ></sl-icon-button>
              </sl-tooltip>
            </div>
          </div>
          <div class="contents">
            <ti-checkboxes
              .isEditMode=${this.isCheckBoxEditMode}
              .checkboxes=${this.taskData?.checkboxes || []}
              @ti-change-checkboxes=${this._handleChangeCheckBoxes}
            ></ti-checkboxes>
          </div>
        </div>
        <!--関連URL-->
        <div class="input-item">
          <div class="label">
            <sl-icon library="taskit" name="globe"></sl-icon>
            <span>関連URL</span>
            <div class="button-area">
              <sl-tooltip content="Edit">
                <sl-icon-button
                  library="taskit"
                  name="pencil-square"
                  class=${this.isUrlEditMode ? "active" : ""}
                  @click=${this._handleClickEditUrl}
                ></sl-icon-button>
              </sl-tooltip>
            </div>
          </div>
          <div class="contents">
            <ti-link
              .isEditMode=${this.isUrlEditMode}
              .links=${this.taskData?.urls ?? []}
              @ti-change-links=${this._handleChangeUrl}
            >
            </ti-link>
          </div>
        </div>
        <!--関連フォルダ-->
        <div class="input-item">
          <div class="label">
            <sl-icon library="taskit" name="folder"></sl-icon>
            <span>関連フォルダ</span>
            <div class="button-area">
              <sl-tooltip content="Edit">
                <sl-icon-button
                  library="taskit"
                  name="pencil-square"
                  class=${this.isFolderEditMode ? "active" : ""}
                  @click=${this._handleClickEditFolder}
                ></sl-icon-button>
              </sl-tooltip>
            </div>
          </div>
          <div class="contents">
            <ti-link
              .isEditMode=${this.isFolderEditMode}
              .links=${this.taskData?.folders ?? []}
              @ti-change-links=${this._handleChangeFolder}
            >
            </ti-link>
          </div>
        </div>
      </div>
    </div>`;
  }

  /**
   * タイトルの変更入力を検知しDBを更新する。
   *
   * @private
   * @returns {*}
   */
  private _handleChangeTitle(): void {
    if (!this.taskData) {
      return;
    }
    this.taskData.title = this.titleInput.value;
    this._updateTaskData();
  }

  /**
   * 期限日の変更入力を検知しDBを更新する。
   *
   * @private
   * @returns {*}
   */
  private _handleChangeDueDate(): void {
    if (!this.taskData) {
      return;
    }

    const dueDateValue = this.dueDateInput.value;
    if (!dueDateValue) {
      return;
    }

    this.taskData.dueDate = new Date(dueDateValue);
    this._updateTaskData();
  }

  /**
   * 説明の変更入力を検知しDBを更新する。
   *
   * @private
   * @return {*}
   * @memberof TiTaskData
   * */
  private _handleChangeDescription(): void {
    if (!this.taskData) {
      return;
    }
    this.taskData.description = this.descriptionInput.value;
    this._updateTaskData();
  }

  /**
   * タスクデータを更新する。
   *
   * @private
   * @return {*}
   * @memberof TiTaskData
   */
  private async _updateTaskData(): Promise<void> {
    if (!this.taskData) {
      return;
    }
    db.updateTask(this.taskData);
    this.taskData = await db.getTaskById(this.taskData.id!);
  }

  /**
   * 関係者の編集モードを切り替える。
   *
   * @private
   * @memberof TiTaskData
   */
  private _handleClickEditMember(): void {
    this.isMemberEditMode = !this.isMemberEditMode;
  }

  /**
   * 関係者を追加する。
   *
   * @private
   * @memberof TiTaskData
   */
  private _handleClickAddMember(): void {
    if (!this.taskData) {
      return;
    }

    if (this.taskData && !this.taskData.members) {
      this.taskData.members = [];
    }

    this.taskData.members.push({
      div: "",
      name: "",
      tel: "",
    });
    this._updateTaskData();
  }

  /**
   * 関係者の変更入力を検知しDBを更新する。
   *
   * @private
   * @memberof TiTaskData
   */
  private _handleChangeMembers(e: CustomEvent): void {
    this.taskData!.members = e.detail;
    if (this.taskData?.members.length === 0) {
      this.isMemberEditMode = false;
    }
    this._updateTaskData();
  }

  /**
   * チェックボックスの編集モードを切り替える。
   *
   * @private
   * @memberof TiTaskData
   */
  private _handleClickEditCheckBox(): void {
    this.isCheckBoxEditMode = !this.isCheckBoxEditMode;
  }

  /**
   * チェックボックスの変更入力を検知しDBを更新する。
   *
   * @private
   * @memberof TiTaskData
   * @param {CustomEvent} e - チェックボックスの変更イベント
   * @returns {*}
   **/
  private _handleChangeCheckBoxes(e: CustomEvent): void {
    this.taskData!.checkboxes = e.detail;
    if (this.taskData?.checkboxes.length === 0) {
      this.isCheckBoxEditMode = false;
    }
    this._updateTaskData();
  }

  /**
   * URLの編集モードを切り替える。
   *
   * @private
   * @memberof TiTaskData
   * @returns {*}
   */
  private _handleClickEditUrl(): void {
    this.isUrlEditMode = !this.isUrlEditMode;
  }

  /**
   * URLの変更入力を検知しDBを更新する。
   * @param e
   * @private
   * @memberof TiTaskData
   * @return {*}
   */
  private _handleChangeUrl(e: CustomEvent): void {
    this.taskData!.urls = e.detail;
    if (this.taskData?.urls.length === 0) {
      this.isUrlEditMode = false;
    }
    this._updateTaskData();
  }

  /**
   * フォルダの編集モードを切り替える。
   *
   * @private
   * @memberof TiTaskData
   * @returns {*}
   */
  private _handleClickEditFolder(): void {
    this.isFolderEditMode = !this.isFolderEditMode;
  }

  /**
   * フォルダの変更入力を検知しDBを更新する。
   * @param e
   * @private
   * @memberof TiTaskData
   * @return {*}
   */
  private _handleChangeFolder(e: CustomEvent): void {
    this.taskData!.folders = e.detail;
    if (this.taskData?.folders.length === 0) {
      this.isFolderEditMode = false;
    }
    this._updateTaskData();
  }
}
