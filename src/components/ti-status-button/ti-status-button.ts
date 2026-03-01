import {
  LitElement,
  html,
  css,
  unsafeCSS,
  PropertyValues,
  HTMLTemplateResult,
} from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { setBasePath } from "@shoelace-style/shoelace/dist/utilities/base-path.js";
import { TASK_STATUS } from "@/models/Task";
import { emit } from "@/service/utils";

import "@shoelace-style/shoelace/dist/themes/light.css";
import styles from "./ti-status-button.lit.scss?inline";

/**
 * UI表示に必要なパラメータの型定義
 */
interface ObjectParameter {
  /** ボタンやバッジのスタイル指定（CSSクラス等に使用） */
  variant: string;
  /** 画面に表示するテキスト */
  label: string;
  /** アイコンフォントのクラス名や識別子 */
  icon: string;
}

setBasePath("/");
@customElement("ti-status-button")
export class TiStatusButton extends LitElement {
  /**
   * スタイルシートを適用
   *
   * @static
   * @memberof TiStatusButton
   */
  static styles = css`
    ${unsafeCSS(styles)}
  `;

  /**
   * タスクのステータス
   *
   * @type {string}
   * @memberof TiStatusButton
   */
  @property({ type: String }) status: string = TASK_STATUS.PENDING.code;

  /**
   * 完了状態
   *
   * @private
   * @type {boolean}
   * @memberof TiStatusButton
   */
  private _isDone: boolean = false;

  /**
   * Creates an instance of TiStatusButton.
   * @memberof TiStatusButton
   */
  constructor() {
    super();
  }

  /**
   * コンポーネントがドキュメントの DOM に追加されたときに実行されます。
   *
   * @override
   * @memberof TiStatusButton
   */
  connectedCallback() {
    super.connectedCallback();
  }

  /**
   * コンポーネントがドキュメントの DOM から削除されたときに実行されます。
   *
   * @override
   * @memberof TiStatusButton
   */
  disconnectedCallback() {
    super.disconnectedCallback();
  }

  /**
   * render直前に実行されます。
   *
   * @protected
   * @param {PropertyValues} _changedProperties
   * @memberof TiStatusButton
   */
  protected willUpdate(_changedProperties: PropertyValues) {
    super.willUpdate(_changedProperties);
    if (_changedProperties.has("status")) {
      this._isDone = this.status === TASK_STATUS.DONE.code;
    }
  }

  /**
   * コンポーネントのメインレイアウトをレンダリングします。
   * アプリケーションの基本構造を定義します。
   *
   * @protected
   * @override
   * @returns {HTMLTemplateResult} レンダリングされる Lit テンプレート
   * @memberof TiStatusButton
   */
  protected render(): HTMLTemplateResult {
    const param = this._getParameter();
    return html`<div id="root">
      <sl-button-group label="statue">
        <sl-button
          size="medium"
          variant="${param.variant}"
          id="status-button"
          ?disabled=${this._isDone}
          @click=${this._handleClickStatusButton}
        >
          <sl-icon library="taskit" name=${param.icon} slot="prefix"></sl-icon>
          ${param.label}
        </sl-button>
        ${this._isDone
          ? html`<sl-dropdown>
              <sl-button
                variant="${param.variant}"
                size="medium"
                slot="trigger"
                caret
              >
              </sl-button>
              <sl-menu>
                <sl-menu-item @click=${this._handleClickStatusButton}>
                  <sl-icon
                    library="taskit"
                    name="arrow-clockwise"
                    slot="prefix"
                  ></sl-icon>
                  再開
                </sl-menu-item>
              </sl-menu>
            </sl-dropdown>`
          : ``}
      </sl-button-group>
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
          variant: "primary",
          label: "開始",
          icon: "play-circle-fill",
        };
      case TASK_STATUS.PROGRESS.code:
        return {
          variant: "success",
          label: "完了",
          icon: "check-circle-fill",
        };
      case TASK_STATUS.DONE.code:
        return {
          variant: "neutral",
          label: "済",
          icon: "slash-circle-fill",
        };
      default:
        return {
          variant: "neutral",
          label: "-",
          icon: "",
        };
    }
  }

  /**
   * ボタン要素の参照を取得します。
   *
   * @private
   * @type {HTMLElement}
   * @memberof TiStatusButton
   */
  @query("#status-button") private _statusButton!: HTMLElement;

  /**
   * ステータス更新ボタンのクリックイベントをハンドリングします。
   * * 現在のステータスに基づいて次の遷移先ステータスを決定し、
   * `ti-change-status` イベントを介して外部へ通知します。
   * * @private
   * @fires ti-change-status - 更新後のステータスコードを detail に含めて発火
   */
  private _handleClickStatusButton(): void {
    // ボタンからフォーカスを外す（disabled 遷移時の Lit/Shoelace の競合を防止）
    if (this._statusButton) {
      (this._statusButton as any).blur();
    }

    let nextStatus: string;
    switch (this.status) {
      case TASK_STATUS.PENDING.code:
        nextStatus = TASK_STATUS.PROGRESS.code;
        break;
      case TASK_STATUS.PROGRESS.code:
        nextStatus = TASK_STATUS.DONE.code;
        break;
      case TASK_STATUS.DONE.code:
        // 完了済みの場合は前の状態に戻す
        nextStatus = TASK_STATUS.PROGRESS.code;
        break;
      default:
        nextStatus = TASK_STATUS.PROGRESS.code;
    }
    emit(this, "ti-change-status", { detail: nextStatus });
  }
}
