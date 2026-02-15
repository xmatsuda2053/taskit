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
import { emit } from "@/service/utils";
import { Member } from "@/models/Member";

import "@shoelace-style/shoelace/dist/themes/light.css";
import styles from "./ti-members.lit.scss?inline";

setBasePath("/");
@customElement("ti-members")
export class TiMembers extends LitElement {
  /**
   * スタイルシートを適用
   *
   * @static
   * @memberof TiMembers
   */
  static styles = css`
    ${unsafeCSS(styles)}
  `;

  /**
   * 関係者プロパティ
   *
   * @type {Member[]}
   * @memberof TiMembers
   */
  @property({ type: Array }) members: Member[] = [];

  /**
   * 編集モードかどうかを管理するフラグ
   * @type {boolean}
   * @memberof TiMembers
   */
  @property({ type: Boolean }) isEditMode: boolean = false;

  /**
   * Creates an instance of TiMembers.
   * @memberof TiMembers
   */
  constructor() {
    super();
  }

  /**
   * コンポーネントがドキュメントの DOM に追加されたときに実行されます。
   *
   * @override
   * @memberof TiMembers
   */
  connectedCallback() {
    super.connectedCallback();
  }

  /**
   * コンポーネントがドキュメントの DOM から削除されたときに実行されます。
   *
   * @override
   * @memberof TiMembers
   */
  disconnectedCallback() {
    super.disconnectedCallback();
  }

  /**
   * render直前に実行されます。
   *
   * @protected
   * @param {PropertyValues} _changedProperties
   * @memberof TiMembers
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
   * @memberof TiMembers
   */
  protected render(): HTMLTemplateResult {
    return html`<div id="root">
      ${this.members.map(
        (member, index) => html`
          <div class="member">
            <sl-input
              value=${member.div}
              size="small"
              placeholder="div..."
              class="member-item div"
              @sl-change=${this._handleChangeMembers}
            >
              <sl-icon library="taskit" name="building" slot="suffix"></sl-icon>
            </sl-input>
            <sl-input
              value=${member.name}
              size="small"
              placeholder="name..."
              class="member-item name"
              @sl-change=${this._handleChangeMembers}
            >
              <sl-icon
                library="taskit"
                name="person-circle"
                slot="suffix"
              ></sl-icon>
            </sl-input>
            <sl-input
              value=${member.tel}
              size="small"
              placeholder="tell..."
              class="member-item tel"
              @sl-change=${this._handleChangeMembers}
            >
              <sl-icon library="taskit" name="telephone" slot="suffix"></sl-icon
            ></sl-input>
            ${this.isEditMode
              ? html` <div class="action-item">
                  <sl-tooltip content="Delete">
                    <sl-icon-button
                      library="taskit"
                      name="dash-circle-fill"
                      @click=${() => this._handleDeleteMembers(index)}
                    ></sl-icon-button
                  ></sl-tooltip>
                </div>`
              : ``}
          </div>
        `,
      )}
    </div>`;
  }

  /**
   * 関係者の変更入力を検知し、カスタムイベント "ti-change-members" を送出します。
   * イベントの detail には、更新された関係者の配列が含まれます。
   * @private
   * @memberof TiMembers
   */
  private _handleChangeMembers() {
    const memberElements = Array.from(
      this.renderRoot.querySelectorAll(".member"),
    );

    const updatedMembers: Member[] = memberElements.map((el) => {
      const getVal = (name: string): string => {
        return (el?.querySelector(name) as HTMLInputElement).value;
      };
      return {
        div: getVal(".div"),
        name: getVal(".name"),
        tel: getVal(".tel"),
      };
    });

    emit(this, "ti-change-members", { detail: updatedMembers });
  }

  /**
   * 指定した関係者レコードを削除する。
   *
   * @private
   * @param {number} index
   * @memberof TiMembers
   */
  private _handleDeleteMembers(index: number) {
    this.members.splice(index, 1);
    emit(this, "ti-change-members", { detail: this.members });
  }
}
