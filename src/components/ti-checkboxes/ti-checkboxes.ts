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
import { emit } from "@/service/utils";
import { CB } from "@/models/CB";

import "@shoelace-style/shoelace/dist/themes/light.css";
import styles from "./ti-checkboxes.lit.scss?inline";
import { SlTextarea } from "@shoelace-style/shoelace";
import { i } from "node_modules/vite/dist/node/chunks/moduleRunnerTransport";

setBasePath("/");
@customElement("ti-checkboxes")
export class TiCheckboxes extends LitElement {
  /**
   * スタイルシートを適用
   *
   * @static
   * @memberof TiCheckboxes
   */
  static styles = css`
    ${unsafeCSS(styles)}
  `;

  @query("#checkboxes-textarea") private textarea!: SlTextarea;

  /**
   * チェックボックスプロパティ
   *
   * @type {Member[]}
   * @memberof TiCheckboxes
   */
  @property({ type: Array }) checkboxes: CB[] = [];

  /**
   * 編集モードかどうかを管理するフラグ
   * @type {boolean}
   * @memberof TiCheckboxes
   */
  @property({ type: Boolean }) isEditMode: boolean = false;

  /**
   * Creates an instance of TiCheckboxes.
   * @memberof TiCheckboxes
   */
  constructor() {
    super();
  }

  /**
   * コンポーネントがドキュメントの DOM に追加されたときに実行されます。
   *
   * @override
   * @memberof TiCheckboxes
   */
  connectedCallback() {
    super.connectedCallback();
  }

  /**
   * コンポーネントがドキュメントの DOM から削除されたときに実行されます。
   *
   * @override
   * @memberof TiCheckboxes
   */
  disconnectedCallback() {
    super.disconnectedCallback();
  }

  /**
   * render直前に実行されます。
   *
   * @protected
   * @param {PropertyValues} _changedProperties
   * @memberof TiCheckboxes
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
   * Textareaの値を解析して checkboxes プロパティを更新する
   */
  private _handleSaveFromTextarea() {
    if (!this.textarea) return;

    const rawValue = this.textarea.value;

    // 行ごとに分割してパース処理
    const updateCheckboxes: CB[] = rawValue
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line !== "") // 空行を除外
      .map((line) => {
        // Markdownのチェックボックス構文を判定
        // [x] または [X] なら true、それ以外（[ ] など）なら false
        const isChecked = /^-\s*\[[xX]\]/.test(line);

        // ラベル部分の抽出（"- [ ] " や "- [x] " の後ろの文字列を取得）
        const label = line.replace(/^-\s*\[[ xX]\]\s*/, "");

        return {
          label: label,
          isChecked: isChecked,
        };
      })
      .filter((item) => item.label !== ""); // ラベルが空の項目を除外;

    // 結果をコンソール出力
    emit(this, "ti-change-checkboxes", { detail: updateCheckboxes });
  }

  /**
   * コンポーネントのメインレイアウトをレンダリングします。
   * アプリケーションの基本構造を定義します。
   *
   * @protected
   * @override
   * @returns {HTMLTemplateResult} レンダリングされる Lit テンプレート
   * @memberof TiCheckboxes
   */
  protected render(): HTMLTemplateResult {
    if (this.isEditMode) {
      return html`<sl-textarea
        id="checkboxes-textarea"
        resize="auto"
        size="small"
        value="${this._convertCheckboxesToText()}"
        @keydown=${this._handleKeyDown}
      ></sl-textarea>`;
    } else if (this.checkboxes.length > 0) {
      return html`<div class="checkbox-area">
        ${this.checkboxes.map((cb, index) => {
          return html`<div class="checkbox-line">
            <sl-checkbox
              size="small"
              ?checked=${cb.isChecked}
              class=${cb.isChecked ? "checked" : ""}
              @sl-change=${(e: Event) => this._handleChangeChecked(e, index)}
            >
              ${cb.label}
            </sl-checkbox>
          </div>`;
        })}
      </div>`;
    } else {
      return html``;
    }
  }

  /**
   * checkboxes プロパティの内容を Markdown のチェックボックス構文に変換する
   *
   * @returns {string} Markdown形式のチェックボックスリスト
   * @memberof TiCheckboxes
   */
  private _convertCheckboxesToText(): string {
    if (this.checkboxes.length === 0) {
      return "- [ ] ";
    }
    return this.checkboxes
      .map((cv) => {
        const checkboxSyntax = cv.isChecked ? "- [x] " : "- [ ] ";
        return checkboxSyntax + cv.label;
      })
      .join("\n");
  }

  /**
   * Enterキー押下時のチェックボックス自動挿入ハンドラ
   * * 現在の行が Markdown のチェックボックス構文（- [ ] または - [x]）で
   * 始まっている場合、改行後に新しい未チェックのボックスを自動挿入します。
   *
   * @private
   * @param {KeyboardEvent} e - キーボードイベント
   * @memberof TiCheckboxes
   */
  private async _handleKeyDown(e: KeyboardEvent) {
    // Enterキー以外、またはIME（日本語入力など）の確定時のEnterは除外
    if (e.key !== "Enter" || e.isComposing) {
      return;
    }

    if (!this.textarea) {
      return;
    }

    // Shoelace(sl-textarea) 内部のネイティブな textarea 要素にアクセス
    const nativeTextarea = this.textarea.input as HTMLTextAreaElement;

    // 現在の選択範囲（カーソル位置）とテキスト全体を取得
    const start = nativeTextarea.selectionStart;
    const end = nativeTextarea.selectionEnd;
    const value = this.textarea.value;

    // 文頭からカーソル位置までのテキストを切り出し、現在の行の内容を特定
    const textBeforeCursor = value.substring(0, start);
    const currentLine = textBeforeCursor.split("\n").pop() || "";

    // チェックボックス構文（- [ ] または - [x]）にマッチするか確認
    // ^\s* : 行頭の空白を許容 / [ xX] : 未チェックまたはチェック済みの両方に対応
    const checkboxRegex = /^\s*- \[[ xX]\]/;
    const match = currentLine.match(checkboxRegex);

    if (match) {
      // 標準の改行処理を抑制
      e.preventDefault();

      // 新しい行に挿入する文字列（常に未チェック状態のボックスを生成）
      const insertText = "\n- [ ] ";

      // カーソル位置を起点に、前後の文字列と新しいボックス構文を結合
      const newValue =
        value.substring(0, start) + insertText + value.substring(end);

      // コンポーネントに新しい値を反映
      this.textarea.value = newValue;

      // Shoelace のレンダリング更新が完了するのを待機
      // これを待つことで、以降の setSelectionRange が正しく動作する
      await this.textarea.updateComplete;

      // カーソルを新しく挿入された行の末尾へ移動
      const newPos = start + insertText.length;
      nativeTextarea.setSelectionRange(newPos, newPos);

      // 入力を継続できるようフォーカスを当てる
      this.textarea.focus();
    }
  }

  /**
   * チェックボックスの状態が変更されたときのハンドラ
   * @private
   * @param e
   * @param index
   */
  private _handleChangeChecked(e: Event, index: number) {
    const target = e.target as HTMLInputElement;
    const updatedCheckboxes = [...this.checkboxes];
    updatedCheckboxes[index].isChecked = target.checked;
    emit(this, "ti-change-checkboxes", { detail: updatedCheckboxes });
  }
}
