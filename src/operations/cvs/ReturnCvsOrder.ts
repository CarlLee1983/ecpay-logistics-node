import { Content } from '../../base/Content.js'
import { LogisticsError } from '../../errors/LogisticsError.js'

export class ReturnCvsOrder extends Content {
  // Use Create path but different Logic, no, usually different path.
  // Checking PHP: ReturnCvsOrder uses /Express/ReturnCVS
  protected requestPath = '/Express/ReturnCVS'

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
    if (name.length > ReturnCvsOrder.GOODS_NAME_MAX_LENGTH) {
      throw LogisticsError.tooLong('GoodsName', ReturnCvsOrder.GOODS_NAME_MAX_LENGTH)
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
    if (name.length > ReturnCvsOrder.SENDER_NAME_MAX_LENGTH) {
      throw LogisticsError.tooLong('SenderName', ReturnCvsOrder.SENDER_NAME_MAX_LENGTH)
    }
    this.content.SenderName = name
    return this
  }

  public setSenderPhone(phone: string): this {
    this.content.SenderPhone = phone
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
    if (!this.content.GoodsName) throw LogisticsError.required('GoodsName')
    if (!this.content.GoodsAmount) throw LogisticsError.required('GoodsAmount')
    if (!this.content.SenderName) throw LogisticsError.required('SenderName')
    if (!this.content.SenderPhone) throw LogisticsError.required('SenderPhone')
  }
}
