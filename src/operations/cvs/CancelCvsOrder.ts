import { Content } from '../../base/Content.js'
import { LogisticsError } from '../../errors/LogisticsError.js'

/**
 * CancelCvsOrder - 取消超商取貨物流訂單
 *
 * 用於取消已建立的超商取貨訂單。
 *
 * @extends Content
 * @example
 * ```typescript
 * const cancelOrder = new CancelCvsOrder('merchantID', 'hashKey', 'hashIV')
 *   .setAllPayLogisticsID('1234567890')
 *   .setCVSPaymentNo('F1234567')
 *   .setCVSValidationNo('1234')
 *
 * const content = cancelOrder.getContent()
 * ```
 */
export class CancelCvsOrder extends Content {
  protected requestPath = '/Express/CancelCVS'

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
   * 設定寄貨編號
   *
   * @param no - 寄貨編號（由建立訂單時取得）
   * @returns 當前實例，支援鏈式呼叫
   */
  public setCVSPaymentNo(no: string): this {
    this.content.CVSPaymentNo = no
    return this
  }

  /**
   * 設定驗證碼
   *
   * @param no - 驗證碼（由建立訂單時取得）
   * @returns 當前實例，支援鏈式呼叫
   */
  public setCVSValidationNo(no: string): this {
    this.content.CVSValidationNo = no
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
    if (!this.content.CVSPaymentNo) throw LogisticsError.required('CVSPaymentNo')
    if (!this.content.CVSValidationNo) throw LogisticsError.required('CVSValidationNo')
  }
}
