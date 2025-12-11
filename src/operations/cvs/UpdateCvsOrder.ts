import { Content } from '../../base/Content.js'
import { LogisticsError } from '../../errors/LogisticsError.js'
import { formatECPayDate } from '../../utils/date.js'

/**
 * UpdateCvsOrder - 更新超商取貨物流訂單
 *
 * 用於更新已建立的超商取貨訂單資訊，如出貨日期、收件門市等。
 *
 * @extends Content
 * @example
 * ```typescript
 * const updateOrder = new UpdateCvsOrder('merchantID', 'hashKey', 'hashIV')
 *   .setAllPayLogisticsID('1234567890')
 *   .setShipmentDate(new Date())
 *   .setReceiverStoreID('991182')
 *
 * const content = updateOrder.getContent()
 * ```
 */
export class UpdateCvsOrder extends Content {
  protected requestPath = '/Express/UpdateShipmentInfo'

  /**
   * 建立 UpdateCvsOrder 實例
   *
   * @param merchantID - 特約商店編號
   * @param hashKey - HashKey
   * @param hashIV - HashIV
   */
  constructor(merchantID: string = '', hashKey: string = '', hashIV: string = '') {
    super(merchantID, hashKey, hashIV)
    // 設定預設出貨日期為今天
    this.content.ShipmentDate = formatECPayDate(new Date())
  }

  /**
   * 初始化請求內容
   *
   * @protected
   */
  protected initContent(): void {
    super.initContent()
    // 更新操作不需要額外的預設參數
  }

  /**
   * 設定綠界物流交易編號
   *
   * @param id - 原訂單的 AllPayLogisticsID
   * @returns 當前實例，支援鏈式呼叫
   */
  public setAllPayLogisticsID(id: string): this {
    this.content.AllPayLogisticsID = id
    return this
  }

  /**
   * 設定出貨日期
   *
   * @param date - 出貨日期（Date 物件或 YYYY/MM/DD 格式字串）
   * @returns 當前實例，支援鏈式呼叫
   */
  public setShipmentDate(date: Date | string): this {
    if (date instanceof Date) {
      this.content.ShipmentDate = formatECPayDate(date)
    } else {
      this.content.ShipmentDate = date
    }
    return this
  }

  /**
   * 設定收件門市編號
   *
   * @param storeId - 新的收件門市編號
   * @returns 當前實例，支援鏈式呼叫
   */
  public setReceiverStoreID(storeId: string): this {
    this.content.ReceiverStoreID = storeId
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
  }
}
