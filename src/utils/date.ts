/**
 * ECPay 日期格式化工具函式
 *
 * ECPay API 使用特定的日期格式，此模組提供統一的格式化方法。
 */

/**
 * 格式化日期時間為 ECPay API 格式
 *
 * @param date - 要格式化的日期物件
 * @returns 格式化後的日期時間字串 (YYYY/MM/DD HH:mm:ss)
 * @example
 * ```typescript
 * const formatted = formatECPayDateTime(new Date())
 * // 輸出: "2024/01/15 14:30:00"
 * ```
 */
export function formatECPayDateTime(date: Date): string {
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  const hh = String(date.getHours()).padStart(2, '0')
  const ii = String(date.getMinutes()).padStart(2, '0')
  const ss = String(date.getSeconds()).padStart(2, '0')
  return `${yyyy}/${mm}/${dd} ${hh}:${ii}:${ss}`
}

/**
 * 格式化日期為 ECPay API 格式（僅日期）
 *
 * @param date - 要格式化的日期物件
 * @returns 格式化後的日期字串 (YYYY/MM/DD)
 * @example
 * ```typescript
 * const formatted = formatECPayDate(new Date())
 * // 輸出: "2024/01/15"
 * ```
 */
export function formatECPayDate(date: Date): string {
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  return `${yyyy}/${mm}/${dd}`
}

/**
 * 取得當前日期時間的 ECPay 格式字串
 *
 * @returns 當前日期時間的格式化字串 (YYYY/MM/DD HH:mm:ss)
 */
export function getCurrentECPayDateTime(): string {
  return formatECPayDateTime(new Date())
}

/**
 * 取得當前日期的 ECPay 格式字串
 *
 * @returns 當前日期的格式化字串 (YYYY/MM/DD)
 */
export function getCurrentECPayDate(): string {
  return formatECPayDate(new Date())
}

