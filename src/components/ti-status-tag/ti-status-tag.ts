import {
  LitElement,
  html,
  css,
  unsafeCSS,
  PropertyValues,
  HTMLTemplateResult,
} from "lit";
import { customElement, property } from "lit/decorators.js";
import { setBasePath } from "@shoelace-style/shoelace/dist/utilities/base-path.js";
import { TASK_STATUS } from "@/models/Task";

import "@shoelace-style/shoelace/dist/themes/light.css";
import styles from "./ti-status-tag.lit.scss?inline";

/**
 * UI表示に必要なパラメータの型定義
 */
interface ObjectParameter {
  /** ボタンやバッジのスタイル指定（CSSクラス等に使用） */
  variant: string;
  /** アイコンフォントのクラス名や識別子 */
  icon: string;
}

setBasePath("/");
@customElement("ti-status-tag")
export class TiStatusTag extends LitElement {
  /**
   * スタイルシートを適用
   *
   * @static
   * @memberof TiStatusTag
   */
  static styles = css`
    ${unsafeCSS(styles)}
  `;

  /**
   * タスクのステータス状態
   *
   * @type {number}
   * @memberof TiTaskData
   */
  @property({ type: String }) status?: string;

  /**
   * Creates an instance of TiStatusTag.
   * @memberof TiStatusTag
   */
  constructor() {
    super();
  }

  /**
   * コンポーネントがドキュメントの DOM に追加されたときに実行されます。
   *
   * @override
   * @memberof TiStatusTag
   */
  connectedCallback() {
    super.connectedCallback();
  }

  /**
   * コンポーネントがドキュメントの DOM から削除されたときに実行されます。
   *
   * @override
   * @memberof TiStatusTag
   */
  disconnectedCallback() {
    super.disconnectedCallback();
  }

  /**
   * render直前に実行されます。
   *
   * @protected
   * @param {PropertyValues} _changedProperties
   * @memberof TiStatusTag
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
   * @memberof TiStatusTag
   */
  protected render(): HTMLTemplateResult {
    const param = this._getParameter();
    return html`<div class="status-label ${param.variant}" size="medium">
      <sl-icon library="taskit" name="${param.icon}"></sl-icon>
    </div>`;
  }

  /**
   * 現在のタスクステータスに応じたUI表示用パラメータ（スタイル、ラベル、アイコン）を取得します。
   *
   * @private
   * @returns {TaskParameter} 各ステータスに対応する表示設定オブジェクト
   */
  private _getParameter(): ObjectParameter {
    switch (this.status) {
      case TASK_STATUS.PENDING.code:
        return {
          variant: "neutral",
          icon: "square",
        };
      case TASK_STATUS.PROGRESS.code:
        return {
          variant: "primary",
          icon: "square-half",
        };
      case TASK_STATUS.DONE.code:
        return {
          variant: "success",
          icon: "check-square",
        };
      default:
        return {
          variant: "neutral",
          icon: "",
        };
    }
  }
}
