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
