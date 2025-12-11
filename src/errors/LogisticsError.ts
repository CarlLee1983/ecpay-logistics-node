/**
 * LogisticsError - ECPay 物流 SDK 錯誤類別
 *
 * 提供統一的錯誤處理機制，包含多種靜態工廠方法用於建立常見的錯誤類型。
 *
 * @extends Error
 * @example
 * ```typescript
 * // 拋出必填欄位錯誤
 * throw LogisticsError.required('MerchantID')
 *
 * // 拋出欄位驗證錯誤
 * throw LogisticsError.invalid('GoodsAmount', 'Amount cannot be negative')
 *
 * // 自訂錯誤訊息
 * throw new LogisticsError('Something went wrong')
 * ```
 */
export class LogisticsError extends Error {
  /**
   * 建立 LogisticsError 實例
   *
   * @param message - 錯誤訊息
   */
  constructor(message: string) {
    super(message)
    this.name = 'LogisticsError'
  }

  /**
   * 建立必填欄位錯誤
   *
   * @param field - 缺失的欄位名稱
   * @returns LogisticsError 實例
   */
  static required(field: string): LogisticsError {
    return new LogisticsError(`Missing required field: ${field}`)
  }

  /**
   * 建立欄位驗證錯誤
   *
   * @param field - 驗證失敗的欄位名稱
   * @param reason - 失敗原因
   * @returns LogisticsError 實例
   */
  static invalid(field: string, reason: string): LogisticsError {
    return new LogisticsError(`Invalid field ${field}: ${reason}`)
  }

  /**
   * 建立欄位長度超過限制錯誤
   *
   * @param field - 超過長度限制的欄位名稱
   * @param max - 最大允許長度
   * @returns LogisticsError 實例
   */
  static tooLong(field: string, max: number): LogisticsError {
    return new LogisticsError(`Field ${field} exceeds max length of ${max}`)
  }

  /**
   * 建立 CheckMacValue 驗證失敗錯誤
   *
   * @returns LogisticsError 實例
   */
  static checkMacValueFailed(): LogisticsError {
    return new LogisticsError('CheckMacValue verification failed')
  }

  /**
   * 建立 HTTP 請求錯誤
   *
   * @param message - 錯誤訊息
   * @returns LogisticsError 實例
   */
  static httpError(message: string): LogisticsError {
    return new LogisticsError(`HTTP Request Error: ${message}`)
  }
}
