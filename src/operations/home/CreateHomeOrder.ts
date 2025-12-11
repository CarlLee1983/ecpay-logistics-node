import { Content } from '../../base/Content.js'
import { LogisticsError } from '../../errors/LogisticsError.js'
import { LogisticsType } from '../../enums/LogisticsType.js'
import { LogisticsSubType, LogisticsSubTypeHelpers } from '../../enums/LogisticsSubType.js'
import { Temperature } from '../../enums/Temperature.js'
import { Distance } from '../../enums/Distance.js'
import { Specification } from '../../enums/Specification.js'
import { ScheduledDeliveryTime } from '../../enums/ScheduledDeliveryTime.js'
import { ScheduledPickupTime } from '../../enums/ScheduledPickupTime.js'
import { getCurrentECPayDateTime } from '../../utils/date.js'

/**
 * CreateHomeOrder - 建立宅配物流訂單
 *
 * 支援黑貓宅急便 (TCAT) 和郵局 (POST) 宅配服務。
 *
 * @extends Content
 * @example
 * ```typescript
 * const order = new CreateHomeOrder('merchantID', 'hashKey', 'hashIV')
 *   .useTcat()
 *   .setMerchantTradeNo('ORDER001')
 *   .setGoodsName('測試商品')
 *   .setGoodsAmount(1000)
 *   .setSenderName('寄件人')
 *   .setSenderCellPhone('0912345678')
 *   .setSenderZipCode('106')
 *   .setSenderAddress('台北市大安區...')
 *   .setReceiverName('收件人')
 *   .setReceiverCellPhone('0987654321')
 *   .setReceiverZipCode('100')
 *   .setReceiverAddress('台北市中正區...')
 *   .setServerReplyURL('https://example.com/callback')
 *
 * const content = order.getContent()
 * ```
 */
export class CreateHomeOrder extends Content {
  /** 商品名稱最大長度 */
  public static readonly GOODS_NAME_MAX_LENGTH = 50

  /** 寄件人姓名最大長度 */
  public static readonly SENDER_NAME_MAX_LENGTH = 10

  /** 收件人姓名最大長度 */
  public static readonly RECEIVER_NAME_MAX_LENGTH = 10

  protected requestPath = '/Express/Create'

  /**
   * 初始化請求內容，設定預設值
   *
   * @protected
   */
  protected initContent(): void {
    super.initContent()
    this.content.MerchantTradeDate = getCurrentECPayDateTime()
    this.content.LogisticsType = LogisticsType.HOME
    this.content.LogisticsSubType = LogisticsSubType.TCAT
    this.content.GoodsAmount = 0
  }

  /**
   * 設定物流子類型
   *
   * @param subType - 物流子類型（僅支援 TCAT 或 POST）
   * @returns 當前實例，支援鏈式呼叫
   * @throws {LogisticsError} 當類型不是宅配類型時
   */
  public setLogisticsSubType(subType: LogisticsSubType): this {
    if (!LogisticsSubTypeHelpers.isHome(subType)) {
      throw LogisticsError.invalid('LogisticsSubType', 'Must be a Home delivery type')
    }
    this.content.LogisticsSubType = subType
    this.content.LogisticsType = LogisticsType.HOME
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
    if (amount < 0) {
      throw LogisticsError.invalid('GoodsAmount', 'Amount cannot be negative')
    }
    this.content.GoodsAmount = amount
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
    if (name.length > CreateHomeOrder.GOODS_NAME_MAX_LENGTH) {
      throw LogisticsError.tooLong('GoodsName', CreateHomeOrder.GOODS_NAME_MAX_LENGTH)
    }
    this.content.GoodsName = name
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
    if (name.length > CreateHomeOrder.SENDER_NAME_MAX_LENGTH) {
      throw LogisticsError.tooLong('SenderName', CreateHomeOrder.SENDER_NAME_MAX_LENGTH)
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
   * 設定寄件人手機
   *
   * @param cellPhone - 寄件人手機號碼
   * @returns 當前實例，支援鏈式呼叫
   */
  public setSenderCellPhone(cellPhone: string): this {
    this.content.SenderCellPhone = cellPhone
    return this
  }

  /**
   * 設定寄件人郵遞區號
   *
   * @param zipCode - 郵遞區號
   * @returns 當前實例，支援鏈式呼叫
   */
  public setSenderZipCode(zipCode: string): this {
    this.content.SenderZipCode = zipCode
    return this
  }

  /**
   * 設定寄件人地址
   *
   * @param address - 寄件人地址
   * @returns 當前實例，支援鏈式呼叫
   */
  public setSenderAddress(address: string): this {
    this.content.SenderAddress = address
    return this
  }

  /**
   * 設定收件人姓名
   *
   * @param name - 收件人姓名（最多 10 字元）
   * @returns 當前實例，支援鏈式呼叫
   * @throws {LogisticsError} 當長度超過限制時
   */
  public setReceiverName(name: string): this {
    if (name.length > CreateHomeOrder.RECEIVER_NAME_MAX_LENGTH) {
      throw LogisticsError.tooLong('ReceiverName', CreateHomeOrder.RECEIVER_NAME_MAX_LENGTH)
    }
    this.content.ReceiverName = name
    return this
  }

  /**
   * 設定收件人電話
   *
   * @param phone - 收件人電話號碼
   * @returns 當前實例，支援鏈式呼叫
   */
  public setReceiverPhone(phone: string): this {
    this.content.ReceiverPhone = phone
    return this
  }

  /**
   * 設定收件人手機
   *
   * @param cellPhone - 收件人手機號碼
   * @returns 當前實例，支援鏈式呼叫
   */
  public setReceiverCellPhone(cellPhone: string): this {
    this.content.ReceiverCellPhone = cellPhone
    return this
  }

  /**
   * 設定收件人郵遞區號
   *
   * @param zipCode - 郵遞區號
   * @returns 當前實例，支援鏈式呼叫
   */
  public setReceiverZipCode(zipCode: string): this {
    this.content.ReceiverZipCode = zipCode
    return this
  }

  /**
   * 設定收件人地址
   *
   * @param address - 收件人地址
   * @returns 當前實例，支援鏈式呼叫
   */
  public setReceiverAddress(address: string): this {
    this.content.ReceiverAddress = address
    return this
  }

  /**
   * 設定收件人 Email
   *
   * @param email - 收件人電子郵件
   * @returns 當前實例，支援鏈式呼叫
   */
  public setReceiverEmail(email: string): this {
    this.content.ReceiverEmail = email
    return this
  }

  /**
   * 設定溫層
   *
   * @param temperature - 溫層類型（常溫/冷藏/冷凍）
   * @returns 當前實例，支援鏈式呼叫
   */
  public setTemperature(temperature: Temperature): this {
    this.content.Temperature = temperature
    return this
  }

  /**
   * 設定距離
   *
   * @param distance - 配送距離類型（同縣市/外縣市/離島）
   * @returns 當前實例，支援鏈式呼叫
   */
  public setDistance(distance: Distance): this {
    this.content.Distance = distance
    return this
  }

  /**
   * 設定規格
   *
   * @param specification - 包裹規格（60cm/90cm/120cm/150cm）
   * @returns 當前實例，支援鏈式呼叫
   */
  public setSpecification(specification: Specification): this {
    this.content.Specification = specification
    return this
  }

  /**
   * 設定預定取貨時段
   *
   * @param time - 取貨時段
   * @returns 當前實例，支援鏈式呼叫
   */
  public setScheduledPickupTime(time: ScheduledPickupTime): this {
    this.content.ScheduledPickupTime = time
    return this
  }

  /**
   * 設定預定送達時段
   *
   * @param time - 送達時段
   * @returns 當前實例，支援鏈式呼叫
   */
  public setScheduledDeliveryTime(time: ScheduledDeliveryTime): this {
    this.content.ScheduledDeliveryTime = time
    return this
  }

  /**
   * 驗證請求內容
   *
   * @throws {LogisticsError} 當必要欄位缺失時
   */
  validate(): void {
    this.validateBaseParam()

    if (!this.content.MerchantTradeNo) throw LogisticsError.required('MerchantTradeNo')
    if (!this.content.MerchantTradeDate) throw LogisticsError.required('MerchantTradeDate')
    if (!this.content.LogisticsSubType) throw LogisticsError.required('LogisticsSubType')
    // 使用明確的 undefined/null 檢查，因為 GoodsAmount 為 0 是合法值
    if (this.content.GoodsAmount === undefined || this.content.GoodsAmount === null) {
      throw LogisticsError.required('GoodsAmount')
    }
    if (!this.content.GoodsName) throw LogisticsError.required('GoodsName')

    if (!this.content.SenderName) throw LogisticsError.required('SenderName')
    if (!this.content.SenderPhone && !this.content.SenderCellPhone)
      throw LogisticsError.required('SenderPhone or SenderCellPhone')
    if (!this.content.SenderZipCode) throw LogisticsError.required('SenderZipCode')
    if (!this.content.SenderAddress) throw LogisticsError.required('SenderAddress')

    if (!this.content.ReceiverName) throw LogisticsError.required('ReceiverName')
    if (!this.content.ReceiverPhone && !this.content.ReceiverCellPhone)
      throw LogisticsError.required('ReceiverPhone or ReceiverCellPhone')
    if (!this.content.ReceiverZipCode) throw LogisticsError.required('ReceiverZipCode')
    if (!this.content.ReceiverAddress) throw LogisticsError.required('ReceiverAddress')

    if (!this.content.ServerReplyURL) throw LogisticsError.required('ServerReplyURL')
  }

  // Convenience Methods

  /**
   * 使用黑貓宅急便
   *
   * @returns 當前實例，支援鏈式呼叫
   */
  useTcat(): this {
    return this.setLogisticsSubType(LogisticsSubType.TCAT)
  }

  /**
   * 使用郵局宅配
   *
   * @returns 當前實例，支援鏈式呼叫
   */
  usePostNormal(): this {
    return this.setLogisticsSubType(LogisticsSubType.POST)
  }
}
