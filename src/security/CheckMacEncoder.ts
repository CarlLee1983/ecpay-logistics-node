import { createHash } from 'node:crypto'
import { LogisticsError } from '../errors/LogisticsError.js'

/**
 * CheckMacEncoder
 *
 * 負責產生和驗證 ECPay 物流 API 的 CheckMacValue（檢查碼）。
 *
 * ECPay 物流 API 使用 MD5 雜湊演算法。
 *
 * @example
 * ```typescript
 * const encoder = new CheckMacEncoder('your-hash-key', 'your-hash-iv')
 *
 * // 產生 CheckMacValue
 * const payload = encoder.encodePayload({ MerchantID: '123', ... })
 *
 * // 驗證回應
 * const isValid = encoder.verifyResponse(responseData)
 * ```
 */
export class CheckMacEncoder {
  private readonly hashKey: string
  private readonly hashIV: string

  /**
   * 建立 CheckMacEncoder 實例
   *
   * @param hashKey - ECPay 提供的 HashKey
   * @param hashIV - ECPay 提供的 HashIV
   * @throws {LogisticsError} 當 HashKey 或 HashIV 缺失時
   */
  constructor(hashKey: string, hashIV: string) {
    if (!hashKey) throw LogisticsError.required('HashKey')
    if (!hashIV) throw LogisticsError.required('HashIV')

    this.hashKey = hashKey
    this.hashIV = hashIV
  }

  /**
   * 為請求內容加入 CheckMacValue
   *
   * @param payload - 原始請求內容
   * @returns 包含 CheckMacValue 的請求內容
   */
  encodePayload(payload: Record<string, unknown>): Record<string, unknown> {
    const data = { ...payload }
    delete data.CheckMacValue

    data.CheckMacValue = this.generateCheckMacValue(data)
    return data
  }

  /**
   * 驗證回應資料的 CheckMacValue
   *
   * @param responseData - ECPay 回應資料
   * @returns 驗證是否通過
   */
  verifyResponse(responseData: Record<string, unknown>): boolean {
    if (!responseData.CheckMacValue) {
      return false
    }

    const receivedCheckMac = responseData.CheckMacValue as string
    const data = { ...responseData }
    delete data.CheckMacValue

    const calculatedCheckMac = this.generateCheckMacValue(data)

    return receivedCheckMac.toUpperCase() === calculatedCheckMac.toUpperCase()
  }

  /**
   * 驗證回應資料，若驗證失敗則拋出錯誤
   *
   * @param responseData - ECPay 回應資料
   * @returns 原始回應資料
   * @throws {LogisticsError} 當 CheckMacValue 驗證失敗時
   */
  verifyOrFail(responseData: Record<string, unknown>): Record<string, unknown> {
    if (!this.verifyResponse(responseData)) {
      throw LogisticsError.checkMacValueFailed()
    }
    return responseData
  }

  /**
   * 使用 MD5 產生 CheckMacValue
   *
   * 步驟：
   * 1. 將參數按照 key 字母順序排序（不區分大小寫）
   * 2. 組合成 query string 格式
   * 3. 在前面加上 HashKey=xxx&，後面加上 &HashIV=xxx
   * 4. URL Encode 後轉小寫
   * 5. 轉換特殊字元以符合 .NET 編碼規則
   * 6. MD5 雜湊後轉大寫
   *
   * @param data - 要計算 CheckMacValue 的資料
   * @returns 大寫的 MD5 雜湊值
   */
  generateCheckMacValue(data: Record<string, unknown>): string {
    // 1. 依 key 字母順序排序（不區分大小寫）
    const sortedKeys = Object.keys(data).sort((a, b) =>
      a.toLowerCase().localeCompare(b.toLowerCase())
    )

    // 2. 組合 query string
    const pairs = sortedKeys.map((key) => `${key}=${String(data[key] ?? '')}`)
    const queryString = pairs.join('&')

    // 3. 加上 HashKey 和 HashIV
    const raw = `HashKey=${this.hashKey}&${queryString}&HashIV=${this.hashIV}`

    // 4. URL Encode 後轉小寫
    let encoded = encodeURIComponent(raw).toLowerCase()

    // 5. 轉換特殊字元以符合 .NET 編碼規則
    encoded = this.dotNetUrlEncode(encoded)

    // 6. MD5 雜湊後轉大寫
    return createHash('md5').update(encoded).digest('hex').toUpperCase()
  }

  /**
   * 轉換 URL 編碼以符合 .NET 規則
   *
   * JavaScript 的 encodeURIComponent 與 .NET 的 UrlEncode 有些差異，
   * 需要手動轉換某些字元。
   *
   * @private
   * @param str - URL 編碼後的字串
   * @returns 符合 .NET 規則的字串
   */
  private dotNetUrlEncode(str: string): string {
    return str
      .replace(/%2d/g, '-')
      .replace(/%5f/g, '_')
      .replace(/%2e/g, '.')
      .replace(/%21/g, '!')
      .replace(/%2a/g, '*')
      .replace(/%28/g, '(')
      .replace(/%29/g, ')')
      .replace(/%20/g, '+')
  }
}
