import { Content } from '../../base/Content.js'
import { LogisticsError } from '../../errors/LogisticsError.js'

export class ReturnHomeOrder extends Content {
  // PHP SDK uses /Express/ReturnHome
  protected requestPath = '/Express/ReturnHome'

  public static readonly GOODS_NAME_MAX_LENGTH = 50
  public static readonly SENDER_NAME_MAX_LENGTH = 10

  public setAllPayLogisticsID(id: string): this {
    this.content.AllPayLogisticsID = id
    return this
  }

  public setServerReplyURL(url: string): this {
    this.content.ServerReplyURL = url
    return this
  }

  public setGoodsName(name: string): this {
    if (name.length > ReturnHomeOrder.GOODS_NAME_MAX_LENGTH) {
      throw LogisticsError.tooLong('GoodsName', ReturnHomeOrder.GOODS_NAME_MAX_LENGTH)
    }
    this.content.GoodsName = name
    return this
  }

  public setGoodsAmount(amount: number): this {
    if (amount < 0) throw LogisticsError.invalid('GoodsAmount', 'Cannot be negative')
    this.content.GoodsAmount = amount
    return this
  }

  public setSenderName(name: string): this {
    if (name.length > ReturnHomeOrder.SENDER_NAME_MAX_LENGTH) {
      throw LogisticsError.tooLong('SenderName', ReturnHomeOrder.SENDER_NAME_MAX_LENGTH)
    }
    this.content.SenderName = name
    return this
  }

  public setSenderPhone(phone: string): this {
    this.content.SenderPhone = phone
    return this
  }

  public setSenderZipCode(zipCode: string): this {
    this.content.SenderZipCode = zipCode
    return this
  }

  public setSenderAddress(address: string): this {
    this.content.SenderAddress = address
    return this
  }

  public setRemark(remark: string): this {
    this.content.Remark = remark
    return this
  }

  public setQuantity(qty: string): this {
    this.content.Quantity = qty
    return this
  }

  public setCost(cost: string): this {
    this.content.Cost = cost
    return this
  }

  validate(): void {
    this.validateBaseParam()

    if (!this.content.AllPayLogisticsID) throw LogisticsError.required('AllPayLogisticsID')
    if (!this.content.ServerReplyURL) throw LogisticsError.required('ServerReplyURL')

    // Note: PHP SDK logic for ReturnHome might require fewer fields than Create,
    // but typically needs Sender info for pickup.
    if (!this.content.SenderName) throw LogisticsError.required('SenderName')
    if (!this.content.SenderPhone) throw LogisticsError.required('SenderPhone')
    if (!this.content.SenderZipCode) throw LogisticsError.required('SenderZipCode')
    if (!this.content.SenderAddress) throw LogisticsError.required('SenderAddress')

    if (!this.content.GoodsName) throw LogisticsError.required('GoodsName')
    if (!this.content.GoodsAmount) throw LogisticsError.required('GoodsAmount')
  }
}
