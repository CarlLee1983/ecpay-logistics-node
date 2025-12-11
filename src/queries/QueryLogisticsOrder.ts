import { Content } from '../base/Content.js'
import { LogisticsError } from '../errors/LogisticsError.js'

/**
 * QueryLogisticsOrder - 查詢物流訂單
 *
 * 用於查詢已建立的物流訂單狀態和資訊。
 *
 * @extends Content
 * @example
 * ```typescript
 * const query = new QueryLogisticsOrder('merchantID', 'hashKey', 'hashIV')
 *   .setAllPayLogisticsID('1234567890')
 *
 * const content = query.getContent()
 * ```
 */
export class QueryLogisticsOrder extends Content {
  protected requestPath = '/Helper/QueryLogisticsTradeInfo/V4'

  /**
   * 初始化請求內容，設定預設值
   *
   * @protected
   */
  protected initContent(): void {
    super.initContent()
    // 設定時間戳記（Unix timestamp，秒）
    this.content.TimeStamp = Math.floor(Date.now() / 1000)
  }

  /**
   * 設定綠界物流交易編號
   *
   * @param id - 要查詢的 AllPayLogisticsID
   * @returns 當前實例，支援鏈式呼叫
   */
  public setAllPayLogisticsID(id: string): this {
    this.content.AllPayLogisticsID = id
    return this
  }

  /**
   * 設定時間戳記
   *
   * @param timestamp - Unix 時間戳記（秒）
   * @returns 當前實例，支援鏈式呼叫
   */
  public setTimeStamp(timestamp: number): this {
    this.content.TimeStamp = timestamp
    return this
  }

  /**
   * 驗證請求內容
   *
   * @throws {LogisticsError} 當必要欄位缺失時
   */
  validate(): void {
    this.validateBaseParam()
    if (!this.content.AllPayLogisticsID) throw LogisticsError.required('AllPayLogisticsID')
    if (!this.content.TimeStamp) throw LogisticsError.required('TimeStamp')
  }
}
