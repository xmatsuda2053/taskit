import {
  LitElement,
  html,
  css,
  unsafeCSS,
  PropertyValues,
  HTMLTemplateResult,
} from "lit";
import { customElement, state, property } from "lit/decorators.js";
import { setBasePath } from "@shoelace-style/shoelace/dist/utilities/base-path.js";
import { emit } from "@/service/utils";

import "@shoelace-style/shoelace/dist/themes/light.css";
import styles from "./ti-input-label.lit.scss?inline";

setBasePath("/");
@customElement("ti-input-label")
export class TiInputLabel extends LitElement {
  /**
   * スタイルシートを適用
   *
   * @static
   * @memberof TiInputLabel
   */
  static styles = css`
    ${unsafeCSS(styles)}
  `;

  /**
   * ラベルタイトル
   *
   * @type {string}
   * @memberof TiInputLabel
   */
  @property({ type: String }) label: string = "";

  /**
   * アイコン名
   *
   * @type {string}
   * @memberof TiInputLabel
   */
  @property({ type: String }) icon: string = "";

  /**
   * 編集可否
   *
   * @type {boolean}
   * @memberof TiInputLabel
   */
  @property({ type: Boolean }) editable: boolean = false;

  /**
   * データ追加可否
   *
   * @type {boolean}
   * @memberof TiInputLabel
   */
  @property({ type: Boolean }) addable: boolean = false;

  /**
   * 編集モードの制御
   *
   * @private
   * @type {boolean}
   * @memberof TiInputLabel
   */
  @state() private isEditMode: boolean = false;

  /**
   * Creates an instance of TiInputLabel.
   * @memberof TiInputLabel
   */
  constructor() {
    super();
  }

  /**
   * コンポーネントがドキュメントの DOM に追加されたときに実行されます。
   *
   * @override
   * @memberof TiInputLabel
   */
  connectedCallback() {
    super.connectedCallback();
  }

  /**
   * コンポーネントがドキュメントの DOM から削除されたときに実行されます。
   *
   * @override
   * @memberof TiInputLabel
   */
  disconnectedCallback() {
    super.disconnectedCallback();
  }

  /**
   * render直前に実行されます。
   *
   * @protected
   * @param {PropertyValues} _changedProperties
   * @memberof TiInputLabel
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
   * @memberof TiInputLabel
   */
  protected render(): HTMLTemplateResult {
    return html`<div class="label">
      <sl-icon library="taskit" name="${this.icon}"></sl-icon>
      <span>${this.label}</span>
      <div class="button-area">
        ${this._renderAddButton()} ${this._renderEditButton()}
      </div>
    </div>`;
  }

  /**
   * 追加ボタンをレンダリングします。
   * 編集可能（editable）かつ追加可能（addable）な設定の場合のみ表示されます。
   *
   * @private
   * @returns {HTMLTemplateResult} 追加ボタンの Lit テンプレート、または空のテンプレート
   * @memberof TiInputLabel
   */
  private _renderAddButton(): HTMLTemplateResult {
    if (!this.editable) return html``;
    if (!this.addable) return html``;

    return html`<sl-tooltip content="Add">
      <sl-icon-button
        library="taskit"
        name="plus-lg"
        ?disabled=${!this.isEditMode}
        @click=${this._handleClickAdd}
      >
      </sl-icon-button>
    </sl-tooltip>`;
  }

  /**
   * 編集ボタンクリックのイベント
   */
  private _handleClickAdd(): void {
    emit(this, "ti-add");
  }

  /**
   * 編集/完了切り替えボタンをレンダリングします。
   * 編集可能（editable）な設定の場合のみ表示され、
   * 現在の編集モード（isEditMode）の状態に応じてアイコンとツールチップを切り替えます。
   *
   * @private
   * @returns {HTMLTemplateResult} 編集または完了ボタンの Lit テンプレート、または空のテンプレート
   * @memberof TiInputLabel
   */
  private _renderEditButton(): HTMLTemplateResult {
    if (!this.editable) return html``;

    return html` <sl-tooltip content="${this.isEditMode ? "Complete" : "Edit"}">
      <sl-icon-button
        library="taskit"
        name="${this.isEditMode ? "check-lg" : "pencil-square"}"
        class=${this.isEditMode ? "active" : ""}
        @click=${this._handleClickEdit}
      ></sl-icon-button>
    </sl-tooltip>`;
  }

  /**
   * 編集ボタンクリックのイベント
   */
  private _handleClickEdit(): void {
    this.isEditMode = !this.isEditMode;
    emit(this, "ti-edit", { detail: this.isEditMode });
  }
}
