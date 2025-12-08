import { Content } from '../../base/Content.js'
import { LogisticsError } from '../../errors/LogisticsError.js'
import { IsCollection } from '../../enums/IsCollection.js'
import { LogisticsSubType, LogisticsSubTypeHelpers } from '../../enums/LogisticsSubType.js'
import { LogisticsType } from '../../enums/LogisticsType.js'

/**
 * Create CVS Order
 *
 * Supports C2C and B2C convenience store pickup orders.
 */
export class CreateCvsOrder extends Content {
  public static readonly GOODS_NAME_MAX_LENGTH = 50
  public static readonly SENDER_NAME_MAX_LENGTH = 10
  public static readonly RECEIVER_NAME_MAX_LENGTH = 10

  protected requestPath = '/Express/Create'

  protected initContent(): void {
    super.initContent()
    const date = new Date()
    // Format: YYYY/MM/DD HH:mm:ss
    const yyyy = date.getFullYear()
    const mm = String(date.getMonth() + 1).padStart(2, '0')
    const dd = String(date.getDate()).padStart(2, '0')
    const hh = String(date.getHours()).padStart(2, '0')
    const ii = String(date.getMinutes()).padStart(2, '0')
    const ss = String(date.getSeconds()).padStart(2, '0')

    this.content.MerchantTradeDate = `${yyyy}/${mm}/${dd} ${hh}:${ii}:${ss}`
    this.content.LogisticsType = LogisticsType.CVS
    this.content.LogisticsSubType = LogisticsSubType.UNIMART_C2C
    this.content.GoodsAmount = 0
    this.content.IsCollection = IsCollection.NO
  }

  /**
   * Set Logistics Sub Type
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
   * Set IsCollection (COD)
   */
  public setIsCollection(isCollection: IsCollection): this {
    this.content.IsCollection = isCollection
    return this
  }

  /**
   * Set Goods Amount
   */
  public setGoodsAmount(amount: number): this {
    if (amount < 0) {
      throw LogisticsError.invalid('GoodsAmount', 'Amount cannot be negative')
    }
    this.content.GoodsAmount = amount
    return this
  }

  /**
   * Set Collection Amount
   */
  public setCollectionAmount(amount: number): this {
    if (amount < 0) {
      throw LogisticsError.invalid('CollectionAmount', 'Amount cannot be negative')
    }
    this.content.CollectionAmount = amount
    return this
  }

  /**
   * Set Service Type (B2C Only)
   */
  public setServiceType(serviceType: string): this {
    this.content.ServiceType = serviceType
    return this
  }

  /**
   * Set Goods Name
   */
  public setGoodsName(name: string): this {
    if (name.length > CreateCvsOrder.GOODS_NAME_MAX_LENGTH) {
      throw LogisticsError.tooLong('GoodsName', CreateCvsOrder.GOODS_NAME_MAX_LENGTH)
    }
    this.content.GoodsName = name
    return this
  }

  /**
   * Set Sender Name
   */
  public setSenderName(name: string): this {
    if (name.length > CreateCvsOrder.SENDER_NAME_MAX_LENGTH) {
      throw LogisticsError.tooLong('SenderName', CreateCvsOrder.SENDER_NAME_MAX_LENGTH)
    }
    this.content.SenderName = name
    return this
  }

  public setSenderPhone(phone: string): this {
    this.content.SenderPhone = phone
    return this
  }

  public setSenderCellPhone(cellPhone: string): this {
    this.content.SenderCellPhone = cellPhone
    return this
  }

  // B2C Only
  public setSenderZipCode(zipCode: string): this {
    this.content.SenderZipCode = zipCode
    return this
  }

  // B2C Only
  public setSenderAddress(address: string): this {
    this.content.SenderAddress = address
    return this
  }

  /**
   * Set Receiver Name
   */
  public setReceiverName(name: string): this {
    if (name.length > CreateCvsOrder.RECEIVER_NAME_MAX_LENGTH) {
      throw LogisticsError.tooLong('ReceiverName', CreateCvsOrder.RECEIVER_NAME_MAX_LENGTH)
    }
    this.content.ReceiverName = name
    return this
  }

  public setReceiverPhone(phone: string): this {
    this.content.ReceiverPhone = phone
    return this
  }

  public setReceiverCellPhone(cellPhone: string): this {
    this.content.ReceiverCellPhone = cellPhone
    return this
  }

  public setReceiverEmail(email: string): this {
    this.content.ReceiverEmail = email
    return this
  }

  public setReceiverStoreID(storeId: string): this {
    this.content.ReceiverStoreID = storeId
    return this
  }

  // B2C Only
  public setReturnStoreID(storeId: string): this {
    this.content.ReturnStoreID = storeId
    return this
  }

  public setAllPayLogisticsID(logisticsId: string): this {
    this.content.AllPayLogisticsID = logisticsId
    return this
  }

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

  useUnimartC2C(): this {
    return this.setLogisticsSubType(LogisticsSubType.UNIMART_C2C)
  }

  useFamiC2C(): this {
    return this.setLogisticsSubType(LogisticsSubType.FAMI_C2C)
  }

  useHilifeC2C(): this {
    return this.setLogisticsSubType(LogisticsSubType.HILIFE_C2C)
  }

  useOkmartC2C(): this {
    return this.setLogisticsSubType(LogisticsSubType.OKMART_C2C)
  }

  useUnimartB2C(): this {
    return this.setLogisticsSubType(LogisticsSubType.UNIMART)
  }

  useFamiB2C(): this {
    return this.setLogisticsSubType(LogisticsSubType.FAMI)
  }

  useHilifeB2C(): this {
    return this.setLogisticsSubType(LogisticsSubType.HILIFE)
  }

  withCollection(amount: number = 0): this {
    this.setIsCollection(IsCollection.YES)
    if (amount > 0) {
      this.setCollectionAmount(amount)
    }
    return this
  }

  withoutCollection(): this {
    return this.setIsCollection(IsCollection.NO)
  }
}
