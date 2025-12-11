import { Content } from '../../base/Content.js'
import { IsCollection } from '../../enums/IsCollection.js'
import { LogisticsSubType, LogisticsSubTypeHelpers } from '../../enums/LogisticsSubType.js'
import { LogisticsType } from '../../enums/LogisticsType.js'
import { LogisticsError } from '../../errors/LogisticsError.js'
import { getCurrentECPayDateTime } from '../../utils/date.js'

/**
 * CreateCvsOrder - 建立超商取貨物流訂單
 *
 * 支援 C2C（店到店）和 B2C（廠商到店）超商取貨服務。
 *
 * 支援的超商：
 * - 7-ELEVEN (UNIMART_C2C / UNIMART)
 * - 全家 FamilyMart (FAMI_C2C / FAMI)
 * - 萊爾富 Hi-Life (HILIFE_C2C / HILIFE)
 * - OK Mart (OKMART_C2C) - 僅 C2C
 *
 * @extends Content
 * @example
 * ```typescript
 * const order = new CreateCvsOrder('merchantID', 'hashKey', 'hashIV')
 *   .useUnimartC2C()
 *   .setMerchantTradeNo('ORDER001')
 *   .setGoodsName('測試商品')
 *   .setGoodsAmount(500)
 *   .setSenderName('寄件人')
 *   .setSenderCellPhone('0912345678')
 *   .setReceiverName('收件人')
 *   .setReceiverCellPhone('0987654321')
 *   .setReceiverStoreID('991182')
 *   .setServerReplyURL('https://example.com/callback')
 *
 * const content = order.getContent()
 * ```
 */
export class CreateCvsOrder extends Content {
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
    this.content.LogisticsType = LogisticsType.CVS
    this.content.LogisticsSubType = LogisticsSubType.UNIMART_C2C
    this.content.GoodsAmount = 0
    this.content.IsCollection = IsCollection.NO
  }

  /**
   * 設定物流子類型
   *
   * @param subType - 超商物流子類型
   * @returns 當前實例，支援鏈式呼叫
   * @throws {LogisticsError} 當類型不是超商類型時
   */
  public setLogisticsSubType(subType: LogisticsSubType): this {
    if (!LogisticsSubTypeHelpers.isCvs(subType)) {
      throw LogisticsError.invalid('LogisticsSubType', 'Must be a CVS type')
    }

    this.content.LogisticsSubType = subType
    this.content.LogisticsType = LogisticsType.CVS
    return this
  }

  /**
   * 設定是否代收貨款
   *
   * @param isCollection - 是否代收貨款
   * @returns 當前實例，支援鏈式呼叫
   */
  public setIsCollection(isCollection: IsCollection): this {
    this.content.IsCollection = isCollection
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
   * 設定代收金額
   *
   * @param amount - 代收金額
   * @returns 當前實例，支援鏈式呼叫
   * @throws {LogisticsError} 當金額為負數時
   */
  public setCollectionAmount(amount: number): this {
    if (amount < 0) {
      throw LogisticsError.invalid('CollectionAmount', 'Amount cannot be negative')
    }
    this.content.CollectionAmount = amount
    return this
  }

  /**
   * 設定服務類型（僅 B2C）
   *
   * @param serviceType - 服務類型
   * @returns 當前實例，支援鏈式呼叫
   */
  public setServiceType(serviceType: string): this {
    this.content.ServiceType = serviceType
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
    if (name.length > CreateCvsOrder.GOODS_NAME_MAX_LENGTH) {
      throw LogisticsError.tooLong('GoodsName', CreateCvsOrder.GOODS_NAME_MAX_LENGTH)
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
    if (name.length > CreateCvsOrder.SENDER_NAME_MAX_LENGTH) {
      throw LogisticsError.tooLong('SenderName', CreateCvsOrder.SENDER_NAME_MAX_LENGTH)
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
   * 設定寄件人郵遞區號（僅 B2C）
   *
   * @param zipCode - 郵遞區號
   * @returns 當前實例，支援鏈式呼叫
   */
  public setSenderZipCode(zipCode: string): this {
    this.content.SenderZipCode = zipCode
    return this
  }

  /**
   * 設定寄件人地址（僅 B2C）
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
    if (name.length > CreateCvsOrder.RECEIVER_NAME_MAX_LENGTH) {
      throw LogisticsError.tooLong('ReceiverName', CreateCvsOrder.RECEIVER_NAME_MAX_LENGTH)
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
   * 設定收件門市編號
   *
   * @param storeId - 收件門市編號（可從 OpenStoreMap 或 GetStoreList 取得）
   * @returns 當前實例，支援鏈式呼叫
   */
  public setReceiverStoreID(storeId: string): this {
    this.content.ReceiverStoreID = storeId
    return this
  }

  /**
   * 設定退貨門市編號（僅 B2C）
   *
   * @param storeId - 退貨門市編號
   * @returns 當前實例，支援鏈式呼叫
   */
  public setReturnStoreID(storeId: string): this {
    this.content.ReturnStoreID = storeId
    return this
  }

  /**
   * 設定綠界物流交易編號
   *
   * @param logisticsId - 綠界物流交易編號
   * @returns 當前實例，支援鏈式呼叫
   */
  public setAllPayLogisticsID(logisticsId: string): this {
    this.content.AllPayLogisticsID = logisticsId
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
    if (!this.content.GoodsName) throw LogisticsError.required('GoodsName')
    if (!this.content.SenderName) throw LogisticsError.required('SenderName')

    if (!this.content.SenderPhone && !this.content.SenderCellPhone) {
      throw LogisticsError.required('SenderPhone or SenderCellPhone')
    }

    if (!this.content.ReceiverName) throw LogisticsError.required('ReceiverName')

    if (!this.content.ReceiverPhone && !this.content.ReceiverCellPhone) {
      throw LogisticsError.required('ReceiverPhone or ReceiverCellPhone')
    }

    if (!this.content.ReceiverStoreID) throw LogisticsError.required('ReceiverStoreID')
    if (!this.content.ServerReplyURL) throw LogisticsError.required('ServerReplyURL')
  }

  // Convenience Methods

  /**
   * 使用 7-ELEVEN C2C（店到店）
   *
   * @returns 當前實例，支援鏈式呼叫
   */
  useUnimartC2C(): this {
    return this.setLogisticsSubType(LogisticsSubType.UNIMART_C2C)
  }

  /**
   * 使用全家 C2C（店到店）
   *
   * @returns 當前實例，支援鏈式呼叫
   */
  useFamiC2C(): this {
    return this.setLogisticsSubType(LogisticsSubType.FAMI_C2C)
  }

  /**
   * 使用萊爾富 C2C（店到店）
   *
   * @returns 當前實例，支援鏈式呼叫
   */
  useHilifeC2C(): this {
    return this.setLogisticsSubType(LogisticsSubType.HILIFE_C2C)
  }

  /**
   * 使用 OK Mart C2C（店到店）
   *
   * @returns 當前實例，支援鏈式呼叫
   */
  useOkmartC2C(): this {
    return this.setLogisticsSubType(LogisticsSubType.OKMART_C2C)
  }

  /**
   * 使用 7-ELEVEN B2C（廠商到店）
   *
   * @returns 當前實例，支援鏈式呼叫
   */
  useUnimartB2C(): this {
    return this.setLogisticsSubType(LogisticsSubType.UNIMART)
  }

  /**
   * 使用全家 B2C（廠商到店）
   *
   * @returns 當前實例，支援鏈式呼叫
   */
  useFamiB2C(): this {
    return this.setLogisticsSubType(LogisticsSubType.FAMI)
  }

  /**
   * 使用萊爾富 B2C（廠商到店）
   *
   * @returns 當前實例，支援鏈式呼叫
   */
  useHilifeB2C(): this {
    return this.setLogisticsSubType(LogisticsSubType.HILIFE)
  }

  /**
   * 啟用代收貨款
   *
   * @param amount - 代收金額（選填，預設 0）
   * @returns 當前實例，支援鏈式呼叫
   */
  withCollection(amount: number = 0): this {
    this.setIsCollection(IsCollection.YES)
    if (amount > 0) {
      this.setCollectionAmount(amount)
    }
    return this
  }

  /**
   * 停用代收貨款
   *
   * @returns 當前實例，支援鏈式呼叫
   */
  withoutCollection(): this {
    return this.setIsCollection(IsCollection.NO)
  }
}
