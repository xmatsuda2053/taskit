import {
  LitElement,
  html,
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
import { type Task } from "@/models/Task";
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
  @state() private _taskData?: Task;

  /**
   * 関係者が編集モードかどうかを管理するフラグ
   * @type {boolean}
   * @memberof TiTaskData
   */
  @state() private _isMemberEditMode: boolean = false;

  /**
   * チェックボックスが編集モードかどうかを管理するフラグ
   *
   * @private
   * @type {boolean}
   * @memberof TiTaskData
   */
  @state() private _isCheckBoxEditMode: boolean = false;

  /**
   * URLが編集モードかどうかを管理するフラグ
   *
   * @private
   * @type {boolean}
   * @memberof TiTaskData
   */
  @state() private _isUrlEditMode: boolean = false;

  /**
   * フォルダが編集モードかどうかを管理するフラグ
   *
   * @private
   * @type {boolean}
   * @memberof TiTaskData
   */
  @state() private _isFolderEditMode: boolean = false;

  /**
   *タイトル入力フィールドの参照を取得するためのクエリデコレーター
   *
   * @private
   * @type {SlInput}
   * @memberof TiTaskData
   */
  @query("#title") private _titleInput!: SlInput;

  /**
   * 期限日入力フィールドの参照を取得するためのクエリデコレーター
   *
   * @private
   * @type {SlInput}
   * @memberof TiTaskData
   */
  @query("#due-date") private _dueDateInput!: SlInput;

  /**
   * 説明入力フィールドの参照を取得するためのクエリデコレーター
   *
   * @private
   * @type {SlTextarea}
   * @memberof TiTaskData
   * */
  @query("#description") private _descriptionTextarea!: SlTextarea;

  /**
   * チェックリスト要素
   *
   * @private
   * @type {TiCheckboxes[]}
   * @memberof TiTaskData
   */
  @queryAll("ti-checkboxes") private _tiCheckboxesElements!: TiCheckboxes[];

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
        this._taskData = await db.getTaskById(this.taskId);
      } else {
        this._taskData = undefined;
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
                  value=${this._taskData?.title}
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
                <ti-input-label
                  .label=${"期限日"}
                  .icon="${"calendar"}"
                ></ti-input-label>
                <sl-input
                  id="due-date"
                  placeholder="due date..."
                  size="small"
                  type="date"
                  value=${formatDate(this._taskData?.dueDate, "yyyy-MM-dd")}
                  @sl-change=${this._handleChangeDueDate}
                >
                </sl-input>
              </div>
              <!--関係者-->
              <div class="input-item">
                <ti-input-label
                  .label=${"関係者"}
                  .icon=${"people"}
                  .editable=${true}
                  .addable=${true}
                  @ti-edit=${this._handleClickEditMember}
                  @ti-add=${this._addMember}
                ></ti-input-label>
                <div id="member" class="contents">
                  <ti-members
                    .isEditMode=${this._isMemberEditMode}
                    .members=${this._taskData?.members || []}
                    @ti-change-members=${this._handleChangeMembers}
                  ></ti-members>
                </div>
              </div>
              <!--説明-->
              <div class="input-item">
                <ti-input-label
                  .label=${"説明"}
                  .icon="${"chat-left-text"}"
                ></ti-input-label>
                <sl-textarea
                  id="description"
                  size="small"
                  rows="8"
                  resize="auto"
                  placeholder="description..."
                  value=${this._taskData?.description}
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
                  ${this._taskData?.checklist.map((c, index) => {
      return html`<ti-checkboxes
                      .label=${c.label}
                      .checkboxes=${c.checkboxes}
                      .isEditMode=${this._isCheckBoxEditMode}
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
                <ti-input-label
                  .label=${"URL"}
                  .icon=${"globe"}
                  .isEditable=${true}
                  @ti-edit=${this._handleClickEditUrl}
                ></ti-input-label>
                <div class="contents">
                  <ti-link
                    .isEditMode=${this._isUrlEditMode}
                    .links=${this._taskData?.urls ?? []}
                    @ti-change-links=${this._handleChangeUrl}
                  >
                  </ti-link>
                </div>
              </div>
              <!--関連フォルダ-->
              <div class="input-item">
                <ti-input-label
                  .label=${"フォルダ"}
                  .icon=${"folder"}
                  .isEditable=${true}
                  @ti-edit=${this._handleClickEditFolder}
                ></ti-input-label>
                <div class="contents">
                  <ti-link
                    .isEditMode=${this._isFolderEditMode}
                    .links=${this._taskData?.folders ?? []}
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
                  <ti-input-label
                    .label=${"検索タグ"}
                    .icon="${"chat-left-text"}"
                  ></ti-input-label>
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
   * タイトルの変更入力を検知しDBを更新する。
   *
   * @private
   * @returns {*}
   */
  private _handleChangeTitle(): void {
    if (!this._taskData) {
      return;
    }
    this._taskData.title = this._titleInput.value;
    this._updateTaskData();
  }

  /**
   * 期限日の変更入力を検知しDBを更新する。
   *
   * @private
   * @returns {*}
   */
  private _handleChangeDueDate(): void {
    if (!this._taskData) {
      return;
    }

    const dueDateValue = this._dueDateInput.value;
    if (!dueDateValue) {
      return;
    }

    this._taskData.dueDate = new Date(dueDateValue);
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
    if (!this._taskData) {
      return;
    }
    this._taskData.description = this._descriptionTextarea.value;
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
    if (!this._taskData) {
      return;
    }
    db.updateTask(this._taskData);
    this._taskData = await db.getTaskById(this._taskData.id!);
  }

  /**
   * 関係者の編集モードを切り替える。
   *
   * @private
   * @memberof TiTaskData
   */
  private _handleClickEditMember(): void {
    this._isMemberEditMode = !this._isMemberEditMode;
  }

  /**
   * 関係者を追加する。
   *
   * @private
   * @memberof TiTaskData
   */
  private _addMember(): void {
    if (!this._taskData) {
      return;
    }

    if (this._taskData && !this._taskData.members) {
      this._taskData.members = [];
    }

    this._taskData.members.push({
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
    this._taskData!.members = e.detail;
    if (this._taskData?.members.length === 0) {
      this._isMemberEditMode = false;
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
      if (this._tiCheckboxesElements && this._taskData) {
        const checkboxEditorDataList = Array.from(this._tiCheckboxesElements)
          .map((c: any) => {
            return typeof c.getEditorData === "function"
              ? c.getEditorData()
              : null;
          })
          .filter((data) => data !== null) as any[];

        this._taskData.checklist = checkboxEditorDataList;
        this._updateTaskData();
      }
    }
    this._isCheckBoxEditMode = e.detail;
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
    if (!this._taskData) {
      return;
    }

    // checklist が未定義の場合は空配列で初期化
    if (this._taskData && !this._taskData.checklist) {
      this._taskData.checklist = [];
    }

    this._taskData.checklist.push({
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
    if (!this._taskData || !this._taskData.checklist) {
      return;
    }

    // イベントから受け取った label と checkboxes を該当のチェックリストに反映する
    this._taskData.checklist[index].checkboxes = e.detail.checkboxes;

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
    this._isUrlEditMode = !this._isUrlEditMode;
  }

  /**
   * URLの変更入力を検知しDBを更新する。
   * @param e
   * @private
   * @memberof TiTaskData
   * @return {*}
   */
  private _handleChangeUrl(e: CustomEvent): void {
    this._taskData!.urls = e.detail;
    if (this._taskData?.urls.length === 0) {
      this._isUrlEditMode = false;
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
    this._isFolderEditMode = !this._isFolderEditMode;
  }

  /**
   * フォルダの変更入力を検知しDBを更新する。
   * @param e
   * @private
   * @memberof TiTaskData
   * @return {*}
   */
  private _handleChangeFolder(e: CustomEvent): void {
    this._taskData!.folders = e.detail;
    if (this._taskData?.folders.length === 0) {
      this._isFolderEditMode = false;
    }
    this._updateTaskData();
  }
}
