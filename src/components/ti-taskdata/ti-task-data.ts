import {
  LitElement,
  html,
  nothing,
  css,
  unsafeCSS,
  PropertyValues,
  HTMLTemplateResult,
} from "lit";
import {
  customElement,
  state,
  property,
  query,
  queryAll,
} from "lit/decorators.js";
import { setBasePath } from "@shoelace-style/shoelace/dist/utilities/base-path.js";
import { db } from "@/service/TaskItDB";
import { TASK_STATUS, type Task } from "@/models/Task";
import { formatDate } from "@/service/utils";

import "@shoelace-style/shoelace/dist/themes/light.css";
import sharedStyles from "@assets/styles/shared.lit.scss?inline";
import styles from "./ti-task-data.lit.scss?inline";
import { SlInput, SlTextarea } from "@shoelace-style/shoelace";
import { TiCheckboxes } from "../ti-checkboxes/ti-checkboxes";

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
   * チェックリスト要素
   *
   * @private
   * @type {TiCheckboxes[]}
   * @memberof TiTaskData
   */
  @queryAll("ti-checkboxes") private tiCheckboxes!: TiCheckboxes[];

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
      <div class="base main-area">
        <sl-tab-group>
          <sl-tab slot="nav" panel="summary">
            <span>サマリ</span>
          </sl-tab>
          <sl-tab slot="nav" panel="checklist">
            <span>チェックリスト</span>
          </sl-tab>
          <sl-tab slot="nav" panel="relation">
            <span>リンク</span>
          </sl-tab>
          <sl-tab slot="nav" panel="property">
            <span>プロパティ</span>
          </sl-tab>

          <sl-tab-panel name="summary">
            <div class="panel-contents scrollable">
              <!--タイトル,コントロールボタン-->
              <div class="input-item title">
                <sl-input
                  id="title"
                  class="title-item"
                  placeholder="title..."
                  size="small"
                  value=${this.taskData?.title}
                  @sl-change=${this._handleChangeTitle}
                ></sl-input>
                <sl-button size="small" variant="primary" class="title-item">
                  <sl-icon
                    library="taskit"
                    name="play-circle-fill"
                    slot="prefix"
                  ></sl-icon>
                  開始
                </sl-button>
              </div>
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
                        ?disabled=${!this.isMemberEditMode}
                        @click=${this._handleClickAddMember}
                      ></sl-icon-button>
                    </sl-tooltip>
                    <sl-tooltip
                      content="${this._getSaveOrEditTooltip(
                        this.isMemberEditMode,
                      )}"
                    >
                      <sl-icon-button
                        library="taskit"
                        name="${this._getSaveOrEditIconName(
                          this.isMemberEditMode,
                        )}"
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
              <!--説明-->
              <div class="input-item">
                <div class="label">
                  <sl-icon library="taskit" name="chat-left-text"></sl-icon>
                  <span>説明</span>
                </div>
                <sl-textarea
                  id="description"
                  size="small"
                  rows="3"
                  resize="auto"
                  placeholder="description..."
                  value=${this.taskData?.description}
                  @sl-change=${this._handleChangeDescription}
                ></sl-textarea>
              </div>
            </div>
          </sl-tab-panel>
          <!--チェックリスト-->
          <sl-tab-panel name="checklist">
            <div class="panel-contents scrollable">
              <div class="input-item">
                <ti-input-label
                  .label=${"リスト一覧"}
                  .icon=${"ui-checks-grid"}
                  .editable=${true}
                  .addable=${true}
                  @ti-edit=${this._handleClickCheckListEdit}
                  @ti-add=${this._addChecklist}
                ></ti-input-label>
                <div class="contents">
                  ${this.taskData?.checklist.map((c, index) => {
                    return html`<ti-checkboxes
                      .label=${c.label}
                      .checkboxes=${c.checkboxes}
                      .isEditMode=${this.isCheckBoxEditMode}
                      @ti-change-checkboxes=${(e: CustomEvent) =>
                        this._saveCheckBoxes(e, index)}
                    ></ti-checkboxes>`;
                  })}
                </div>
              </div>
            </div>
          </sl-tab-panel>
          <!--関連情報-->
          <sl-tab-panel name="relation">
            <div class="panel-contents scrollable">
              <!--関連URL-->
              <div class="input-item">
                <div class="label">
                  <sl-icon library="taskit" name="globe"></sl-icon>
                  <span>URL</span>
                  <div class="button-area">
                    <sl-tooltip
                      content="${this._getSaveOrEditTooltip(
                        this.isUrlEditMode,
                      )}"
                    >
                      <sl-icon-button
                        library="taskit"
                        name="${this._getSaveOrEditIconName(
                          this.isUrlEditMode,
                        )}"
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
                  <span>フォルダ</span>
                  <div class="button-area">
                    <sl-tooltip
                      content="${this._getSaveOrEditTooltip(
                        this.isFolderEditMode,
                      )}"
                    >
                      <sl-icon-button
                        library="taskit"
                        name="${this._getSaveOrEditIconName(
                          this.isFolderEditMode,
                        )}"
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
          </sl-tab-panel>
          <!--プロパティ-->
          <sl-tab-panel name="property">
            <div class="panel-contents scrollable">
              <!--検索タグ-->
              <div class="input-item">
                <div class="input-item">
                  <div class="label">
                    <sl-icon library="taskit" name="folder"></sl-icon>
                    <span>検索タグ</span>
                  </div>
                  <div class="contents">内容</div>
                </div>
              </div>
            </div>
          </sl-tab-panel>
        </sl-tab-group>
      </div>
      <div class="base sub-area">
        <sl-tab-group>
          <sl-tab slot="nav" panel="log">
            <span>ログ</span>
          </sl-tab>
          <sl-tab slot="nav" panel="note">
            <span>ノート</span>
          </sl-tab>
          <sl-tab-panel name="log"> </sl-tab-panel>
          <sl-tab-panel name="note"> </sl-tab-panel>
        </sl-tab-group>
      </div>
    </div>`;
  }

  /**
   * 編集モードに応じたツールチップの内容を取得する。
   *
   * @private
   * @param isEditMode
   * @returns
   */
  private _getSaveOrEditTooltip(isEditMode: boolean): string {
    return isEditMode ? "Complete" : "Edit";
  }

  /**
   * 編集モードに応じたアイコン名を取得する。
   *
   * @private
   * @param isEditMode
   * @returns
   */
  private _getSaveOrEditIconName(isEditMode: boolean): string {
    return isEditMode ? "check-lg" : "pencil-square";
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
   * チェックリストの編集モードを切り替える。
   * 編集モード終了時(`e.detail` が false)には、すべてのチェックボックスコンポーネントから
   * 編集データを取得し、タスクデータのチェックリストを更新してデータベースに保存する。
   *
   * @private
   * @param {CustomEvent<boolean>} e - 編集モードの状態（true: 編集中, false: 編集完了）を含むカスタムイベント
   * @memberof TiTaskData
   */
  private _handleClickCheckListEdit(e: CustomEvent): void {
    if (!e.detail) {
      // 編集モードを終了するフラグがfalseで飛んできたタイミングで、すべての ti-checkboxes から値を取り出して保存
      if (this.tiCheckboxes && this.taskData) {
        const allCheckboxesData = Array.from(this.tiCheckboxes)
          .map((c: any) => {
            return typeof c.getEditorData === "function"
              ? c.getEditorData()
              : null;
          })
          .filter((data) => data !== null) as any[];

        this.taskData.checklist = allCheckboxesData;
        this._updateTaskData();
      }
    }
    this.isCheckBoxEditMode = e.detail;
  }

  /**
   * タスクデータに新しいチェックリスト項目を追加します。
   * checklist プロパティが存在しない場合は初期化を行い、
   * 空のラベルとチェックボックス配列を持つ新しいオブジェクトを末尾に挿入します。
   * 追加後は _updateTaskData() を呼び出して状態を更新します。
   *
   * @private
   * @returns {void}
   * @memberof TiInputLabel
   */
  private _addChecklist(): void {
    if (!this.taskData) {
      return;
    }

    // checklist が未定義の場合は空配列で初期化
    if (this.taskData && !this.taskData.checklist) {
      this.taskData.checklist = [];
    }

    this.taskData.checklist.push({
      label: "",
      checkboxes: [],
    });

    this._updateTaskData();
  }

  /**
   * チェックボックスの変更入力を検知しDBを更新する。
   *
   * @private
   * @memberof TiTaskData
   * @param {CustomEvent} e - チェックボックスの変更イベント
   * @param {number} index - 変更されたチェックリストのインデックス
   * @returns {*}
   **/
  private _saveCheckBoxes(e: CustomEvent, index: number): void {
    if (!this.taskData || !this.taskData.checklist) {
      return;
    }

    // イベントから受け取った label と checkboxes を該当のチェックリストに反映する
    this.taskData.checklist[index].checkboxes = e.detail.checkboxes;

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
