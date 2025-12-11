import { Content } from '../../base/Content.js'
import { LogisticsError } from '../../errors/LogisticsError.js'

/**
 * ReturnCvsOrder - 超商取貨逆物流訂單
 *
 * 用於建立超商取貨的退貨/逆物流訂單。
 *
 * @extends Content
 * @example
 * ```typescript
 * const returnOrder = new ReturnCvsOrder('merchantID', 'hashKey', 'hashIV')
 *   .setAllPayLogisticsID('1234567890')
 *   .setServerReplyURL('https://example.com/callback')
 *   .setGoodsName('退貨商品')
 *   .setGoodsAmount(1000)
 *   .setSenderName('王小明')
 *   .setSenderPhone('0912345678')
 *
 * const content = returnOrder.getContent()
 * ```
 */
export class ReturnCvsOrder extends Content {
  protected requestPath = '/Express/ReturnCVS'

  /** 商品名稱最大長度 */
  public static readonly GOODS_NAME_MAX_LENGTH = 50

  /** 寄件人姓名最大長度 */
  public static readonly SENDER_NAME_MAX_LENGTH = 10

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
   * 設定伺服器回覆網址
   *
   * @param url - 接收 ECPay 通知的伺服器網址
   * @returns 當前實例，支援鏈式呼叫
   */
  public setServerReplyURL(url: string): this {
    this.content.ServerReplyURL = url
    return this
  }

  /**
   * 設定商品名稱
   *
   * @param name - 商品名稱（最多 50 字元）
   * @returns 當前實例，支援鏈式呼叫
   * @throws {LogisticsError} 當長度超過限制時
   */
  public setGoodsName(name: string): this {
    if (name.length > ReturnCvsOrder.GOODS_NAME_MAX_LENGTH) {
      throw LogisticsError.tooLong('GoodsName', ReturnCvsOrder.GOODS_NAME_MAX_LENGTH)
    }
    this.content.GoodsName = name
    return this
  }

  /**
   * 設定商品金額
   *
   * @param amount - 商品金額（允許 0）
   * @returns 當前實例，支援鏈式呼叫
   * @throws {LogisticsError} 當金額為負數時
   */
  public setGoodsAmount(amount: number): this {
    if (amount < 0) throw LogisticsError.invalid('GoodsAmount', 'Cannot be negative')
    this.content.GoodsAmount = amount
    return this
  }

  /**
   * 設定寄件人姓名
   *
   * @param name - 寄件人姓名（最多 10 字元）
   * @returns 當前實例，支援鏈式呼叫
   * @throws {LogisticsError} 當長度超過限制時
   */
  public setSenderName(name: string): this {
    if (name.length > ReturnCvsOrder.SENDER_NAME_MAX_LENGTH) {
      throw LogisticsError.tooLong('SenderName', ReturnCvsOrder.SENDER_NAME_MAX_LENGTH)
    }
    this.content.SenderName = name
    return this
  }

  /**
   * 設定寄件人電話
   *
   * @param phone - 寄件人電話號碼
   * @returns 當前實例，支援鏈式呼叫
   */
  public setSenderPhone(phone: string): this {
    this.content.SenderPhone = phone
    return this
  }

  /**
   * 設定備註
   *
   * @param remark - 備註內容
   * @returns 當前實例，支援鏈式呼叫
   */
  public setRemark(remark: string): this {
    this.content.Remark = remark
    return this
  }

  /**
   * 設定商品數量
   *
   * @param qty - 商品數量
   * @returns 當前實例，支援鏈式呼叫
   */
  public setQuantity(qty: string): this {
    this.content.Quantity = qty
    return this
  }

  /**
   * 設定商品成本
   *
   * @param cost - 商品成本
   * @returns 當前實例，支援鏈式呼叫
   */
  public setCost(cost: string): this {
    this.content.Cost = cost
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
    if (!this.content.ServerReplyURL) throw LogisticsError.required('ServerReplyURL')
    if (!this.content.GoodsName) throw LogisticsError.required('GoodsName')
    // 使用明確的 undefined/null 檢查，因為 GoodsAmount 為 0 是合法值
    if (this.content.GoodsAmount === undefined || this.content.GoodsAmount === null) {
      throw LogisticsError.required('GoodsAmount')
    }
    if (!this.content.SenderName) throw LogisticsError.required('SenderName')
    if (!this.content.SenderPhone) throw LogisticsError.required('SenderPhone')
  }
}
