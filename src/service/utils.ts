import type { SlAlert } from "@shoelace-style/shoelace";

/**
 * 日付オブジェクトを指定されたフォーマットの文字列に変換します。
 * * 使用可能なトークン: yyyy, MM, dd, HH, mm, ss
 *
 * @export
 * @param {Date} [date] - 変換対象の日付オブジェクト。
 * @param {string} [format="yyyy/MM/dd HH:mm:ss"] - フォーマット形式。
 * @returns {string} フォーマット済みの日付文字列、または空文字。
 */
export function formatDate(
  date?: Date,
  format: string = "yyyy/MM/dd HH:mm:ss",
): string {
  if (!date) return "";

  const pad = (num: number) => String(num).padStart(2, "0");

  const values: { [key: string]: string | number } = {
    yyyy: date.getFullYear(),
    MM: pad(date.getMonth() + 1),
    dd: pad(date.getDate()),
    HH: pad(date.getHours()),
    mm: pad(date.getMinutes()),
    ss: pad(date.getSeconds()),
  };

  // 正規表現でトークンを一括置換
  return format.replace(/yyyy|MM|dd|HH|mm|ss/g, (matched) =>
    values[matched].toString(),
  );
}

/**
 * 指定された日数後の日付（時刻 00:00:00）を取得する
 * @param {number} days - 加算する日数
 * @returns {Date}
 */
export function getThresholdDate(days: number): Date {
  const date = new Date();
  date.setHours(0, 0, 0, 0); // 時刻をクリア
  date.setDate(date.getDate() + days);
  return date;
}

/**
 * カスタムイベントを生成し、指定した要素から送出（dispatch）します。
 * デフォルトで bubbles と composed が true に設定されており、Shadow DOM の境界を越えて伝播します。
 * @param el - イベントを発生させる対象のHTML要素
 * @param name - カスタムイベントの名前（例: 'fg-change'）
 * @param options - CustomEvent に渡す追加オプション。detail や bubbles の上書きが可能です
 * @returns 送出された CustomEvent オブジェクト
 */
export function emit(el: HTMLElement, name: string, options?: CustomEventInit) {
  const event = new CustomEvent(name, {
    bubbles: true,
    composed: true,
    cancelable: true,
    detail: {},
    ...options, // オプションで上書き可能（個別に false にすることも可能）
  });

  el.dispatchEvent(event);
  return event;
}

/**
 * トースト通知を表示するためのベースとなる共通処理です。
 *
 * @param {string} variant 種類 ("success" | "danger" | "primary" など)
 * @param {string} iconName 表示するアイコンの名前
 * @param {string} title タイトル
 * @param {string} message メッセージ内容
 */
function showToast(
  variant: string,
  iconName: string,
  title: string,
  message: string,
) {
  const alert = Object.assign(document.createElement("sl-alert"), {
    variant: variant,
    duration: 1500,
    closable: true,
    innerHTML: `
        <sl-icon slot="icon" library="fillgo" name="${iconName}"></sl-icon>
        <strong>${title}</strong><br />
        ${message}
      `,
  });
  document.body.append(alert);
  (alert as SlAlert).toast();
}

/**
 * 処理成功時のトーストを表示します。
 *
 * @export
 * @param {string} innerTitleText タイトル
 * @param {string} innerHtmlText メッセージ内容
 */
export function toastSuccess(innerTitleText: string, innerHtmlText: string) {
  showToast("success", "check2-circle", innerTitleText, innerHtmlText);
}

/**
 * 処理失敗時のトーストを表示します。
 *
 * @export
 * @param {string} innerTitleText タイトル
 * @param {string} innerHtmlText メッセージ内容
 */
export function toastDanger(innerTitleText: string, innerHtmlText: string) {
  showToast("danger", "exclamation-octagon", innerTitleText, innerHtmlText);
}
