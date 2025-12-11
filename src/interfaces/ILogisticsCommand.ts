import type { CheckMacEncoder } from '../security/CheckMacEncoder.js'

/**
 * ILogisticsCommand - 物流指令介面
 *
 * 定義所有物流操作類別必須實作的方法。
 * 所有繼承自 Content 的類別都會自動符合此介面。
 */
export interface ILogisticsCommand {
  /**
   * 取得未簽章的請求內容
   *
   * 此方法會先執行驗證，確保所有必要欄位都已設定。
   *
   * @returns 請求內容物件
   * @throws {LogisticsError} 當驗證失敗時
   */
  getPayload(): Record<string, unknown>

  /**
   * 取得已簽章的請求內容
   *
   * 此方法會先執行驗證，然後加入 CheckMacValue。
   *
   * @returns 包含 CheckMacValue 的請求內容物件
   * @throws {LogisticsError} 當驗證失敗時
   */
  getContent(): Record<string, unknown>

  /**
   * 取得 API 請求路徑
   *
   * @returns API 端點路徑（如 /Express/Create）
   */
  getRequestPath(): string

  /**
   * 取得 CheckMacValue 編碼器
   *
   * @returns CheckMacEncoder 實例
   */
  getEncoder(): CheckMacEncoder
}
