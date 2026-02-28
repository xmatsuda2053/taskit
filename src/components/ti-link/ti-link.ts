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
import { emit, toastSuccess } from "@/service/utils";
import { Link } from "@/models/Link";

import "@shoelace-style/shoelace/dist/themes/light.css";
import styles from "./ti-link.lit.scss?inline";
import { SlTextarea } from "@shoelace-style/shoelace";

setBasePath("/");
@customElement("ti-link")
export class TiLink extends LitElement {
  /**
   * スタイルシートを適用
   *
   * @static
   * @memberof TiLink
   */
  static styles = css`
    ${unsafeCSS(styles)}
  `;

  /**
   * Markdown形式のリンクテキスト
   *
   * @type {Link[]}
   * @memberof TiLink
   */
  @property({ type: Array }) links: Link[] = [];

  /**
   * 編集モードかどうかを管理するフラグ
   * @type {boolean}
   * @memberof TiCheckboxes
   */
  @property({ type: Boolean }) isEditMode: boolean = false;

  @query("#links-textarea") private textarea!: SlTextarea;

  /**
   * Creates an instance of TiLink.
   * @memberof TiLink
   */
  constructor() {
    super();
  }

  /**
   * コンポーネントがドキュメントの DOM に追加されたときに実行されます。
   *
   * @override
   * @memberof TiLink
   */
  connectedCallback() {
    super.connectedCallback();
  }

  /**
   * コンポーネントがドキュメントの DOM から削除されたときに実行されます。
   *
   * @override
   * @memberof TiLink
   */
  disconnectedCallback() {
    super.disconnectedCallback();
  }

  /**
   * render直前に実行されます。
   *
   * @protected
   * @param {PropertyValues} _changedProperties
   * @memberof TiLink
   */
  protected willUpdate(_changedProperties: PropertyValues) {
    super.willUpdate(_changedProperties);
    if (_changedProperties.get("isEditMode") === true && !this.isEditMode) {
      if (this.textarea) {
        this._handleSaveFromTextarea();
      }
    }
  }

  /**
   * Textareaの値を解析して links プロパティを更新する
   *
   * @private
   * @memberof TiLink
   */
  private _handleSaveFromTextarea(): void {
    const updateLinks: Link[] = this._parseMarkdownLinks(this.textarea.value);
    emit(this, "ti-change-links", { detail: updateLinks });
  }

  /**
   * Markdown形式のテキストを解析して Link[] に変換する
   *
   * @private
   * @param {string} text
   * @returns {Link[]}
   * @memberof TiLink
   */
  private _parseMarkdownLinks(text: string): Link[] {
    const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/g;
    return [...text.matchAll(linkPattern)].map((match) => ({
      label: match[1],
      path: match[2],
    }));
  }

  /**
   * コンポーネントのメインレイアウトをレンダリングします。
   * アプリケーションの基本構造を定義します。
   *
   * @protected
   * @override
   * @returns {HTMLTemplateResult} レンダリングされる Lit テンプレート
   * @memberof TiLink
   */
  protected render(): HTMLTemplateResult {
    if (this.isEditMode) {
      return html`<sl-textarea
        id="links-textarea"
        resize="auto"
        size="small"
        placeholder="e.g. [Google](https://www.google.com)"
        .value=${this._convertLinksToMarkdown(this.links)}
      ></sl-textarea>`;
    } else if (this.links?.length > 0) {
      return html` <div id="root">
        ${this.links.map(
          (link) =>
            html`<div
              class="link-item"
              @click=${() => this._handleClickLink(link.path)}
            >
              <sl-icon library="taskit" name="copy"></sl-icon>
              <div class="link-label">${link.label}</div>
            </div>`,
        )}
      </div>`;
    } else {
      return html``;
    }
  }

  /**
   * Linkオブジェクトの配列をMarkdown形式のテキストに変換する
   * @param links
   * @returns Markdown形式のテキスト
   * @private
   */
  private _convertLinksToMarkdown(links: Link[]): string {
    return links.map((link) => `[${link.label}](${link.path})`).join("\n");
  }

  /**
   * クリックしたリンクのpathをクリップボードにコピーする
   * @param path
   * @private
   * @memberof TiLink
   */
  private async _handleClickLink(path: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(path);
      toastSuccess("copied", path);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  }
}
