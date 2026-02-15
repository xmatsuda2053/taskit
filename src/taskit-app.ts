import {
  LitElement,
  html,
  css,
  unsafeCSS,
  PropertyValues,
  HTMLTemplateResult,
} from "lit";
import { customElement, state } from "lit/decorators.js";
import { setBasePath } from "@shoelace-style/shoelace/dist/utilities/base-path.js";
import { registerIconLibrary } from "@shoelace-style/shoelace/dist/utilities/icon-library.js";
import { icons } from "@assets/icons";

import "@shoelace-style/shoelace/dist/themes/light.css";
import styles from "./taskit-app.lit.scss?inline";

import "@plugins/shoelace";
import "@components/index";

setBasePath("/");
@customElement("taskit-app")
export class TaskitApp extends LitElement {
  /**
   * スタイルシートを適用
   *
   * @static
   * @memberof TaskitApp
   */
  static styles = css`
    ${unsafeCSS(styles)}
  `;

  /**
   * 選択中のタスクID
   *
   * @type {number}
   * @memberof TaskitApp
   */
  @state() selectedTaskId?: number = undefined;

  /**
   * Creates an instance of TaskitApp.
   * @memberof TaskitApp
   */
  constructor() {
    super();

    // 独自アイコンを登録
    registerIconLibrary("taskit", {
      resolver: (name: string) => {
        if (name in icons) {
          return `data:image/svg+xml;utf8,${encodeURIComponent(icons[name])}`;
        }
        return "";
      },
    });
  }

  /**
   * コンポーネントがドキュメントの DOM に追加されたときに実行されます。
   *
   * @override
   * @memberof TaskitApp
   */
  connectedCallback() {
    super.connectedCallback();
  }

  /**
   * コンポーネントがドキュメントの DOM から削除されたときに実行されます。
   *
   * @override
   * @memberof TaskitApp
   */
  disconnectedCallback() {
    super.disconnectedCallback();
  }

  /**
   * render直前に実行されます。
   *
   * @protected
   * @param {PropertyValues} _changedProperties
   * @memberof TaskitApp
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
   * @memberof TaskitApp
   */
  protected render(): HTMLTemplateResult {
    return html`<div class="container">
      <div class="header-area"></div>
      <div class="menu-area">
        <ti-tasklist
          @ti-taskitem-click=${this._handleTiClickTaskItem}
        ></ti-tasklist>
      </div>
      <div class="contents1-area">
        <ti-task-data .taskId=${this.selectedTaskId}></ti-task-data>
      </div>
      <div class="contents2-area"></div>
      <div class="footer-area"></div>
    </div>`;
  }

  /**
   * リストでクリックしたタスクを選択状態とする。
   *
   * @private
   * @param {CustomEvent} e
   * @memberof TaskitApp
   */
  private _handleTiClickTaskItem(e: CustomEvent) {
    this.selectedTaskId = e.detail.taskId;
  }
}
