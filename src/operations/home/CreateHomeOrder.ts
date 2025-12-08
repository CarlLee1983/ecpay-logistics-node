import { Content } from '../../base/Content.js'
import { LogisticsError } from '../../errors/LogisticsError.js'
import { LogisticsType } from '../../enums/LogisticsType.js'
import { LogisticsSubType, LogisticsSubTypeHelpers } from '../../enums/LogisticsSubType.js'
import { Temperature } from '../../enums/Temperature.js'
import { Distance } from '../../enums/Distance.js'
import { Specification } from '../../enums/Specification.js'
import { ScheduledDeliveryTime } from '../../enums/ScheduledDeliveryTime.js'
import { ScheduledPickupTime } from '../../enums/ScheduledPickupTime.js'

export class CreateHomeOrder extends Content {
  public static readonly GOODS_NAME_MAX_LENGTH = 50
  public static readonly SENDER_NAME_MAX_LENGTH = 10
  public static readonly RECEIVER_NAME_MAX_LENGTH = 10

  protected requestPath = '/Express/Create'

  protected initContent(): void {
    super.initContent()
    const date = new Date()
    const yyyy = date.getFullYear()
    const mm = String(date.getMonth() + 1).padStart(2, '0')
    const dd = String(date.getDate()).padStart(2, '0')
    const hh = String(date.getHours()).padStart(2, '0')
    const ii = String(date.getMinutes()).padStart(2, '0')
    const ss = String(date.getSeconds()).padStart(2, '0')

    this.content.MerchantTradeDate = `${yyyy}/${mm}/${dd} ${hh}:${ii}:${ss}`
    this.content.LogisticsType = LogisticsType.HOME
    this.content.LogisticsSubType = LogisticsSubType.TCAT
    this.content.GoodsAmount = 0
  }

  public setLogisticsSubType(subType: LogisticsSubType): this {
    if (!LogisticsSubTypeHelpers.isHome(subType)) {
      throw LogisticsError.invalid('LogisticsSubType', 'Must be a Home delivery type')
    }
    this.content.LogisticsSubType = subType
    this.content.LogisticsType = LogisticsType.HOME
    return this
  }

  public setGoodsAmount(amount: number): this {
    if (amount < 0) {
      throw LogisticsError.invalid('GoodsAmount', 'Amount cannot be negative')
    }
    this.content.GoodsAmount = amount
    return this
  }

  public setGoodsName(name: string): this {
    if (name.length > CreateHomeOrder.GOODS_NAME_MAX_LENGTH) {
      throw LogisticsError.tooLong('GoodsName', CreateHomeOrder.GOODS_NAME_MAX_LENGTH)
    }
    this.content.GoodsName = name
    return this
  }

  public setSenderName(name: string): this {
    if (name.length > CreateHomeOrder.SENDER_NAME_MAX_LENGTH) {
      throw LogisticsError.tooLong('SenderName', CreateHomeOrder.SENDER_NAME_MAX_LENGTH)
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

  public setSenderZipCode(zipCode: string): this {
    this.content.SenderZipCode = zipCode
    return this
  }

  public setSenderAddress(address: string): this {
    this.content.SenderAddress = address
    return this
  }

  public setReceiverName(name: string): this {
    if (name.length > CreateHomeOrder.RECEIVER_NAME_MAX_LENGTH) {
      throw LogisticsError.tooLong('ReceiverName', CreateHomeOrder.RECEIVER_NAME_MAX_LENGTH)
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

  public setReceiverZipCode(zipCode: string): this {
    this.content.ReceiverZipCode = zipCode
    return this
  }

  public setReceiverAddress(address: string): this {
    this.content.ReceiverAddress = address
    return this
  }

  public setReceiverEmail(email: string): this {
    this.content.ReceiverEmail = email
    return this
  }

  public setTemperature(temperature: Temperature): this {
    this.content.Temperature = temperature
    return this
  }

  public setDistance(distance: Distance): this {
    this.content.Distance = distance
    return this
  }

  public setSpecification(specification: Specification): this {
    this.content.Specification = specification
    return this
  }

  public setScheduledPickupTime(time: ScheduledPickupTime): this {
    this.content.ScheduledPickupTime = time
    return this
  }

  public setScheduledDeliveryTime(time: ScheduledDeliveryTime): this {
    this.content.ScheduledDeliveryTime = time
    return this
  }

  validate(): void {
    this.validateBaseParam()

    if (!this.content.MerchantTradeNo) throw LogisticsError.required('MerchantTradeNo')
    if (!this.content.MerchantTradeDate) throw LogisticsError.required('MerchantTradeDate')
    if (!this.content.LogisticsSubType) throw LogisticsError.required('LogisticsSubType')
    if (!this.content.GoodsAmount) throw LogisticsError.required('GoodsAmount')
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

  useTcat(): this {
    return this.setLogisticsSubType(LogisticsSubType.TCAT)
  }

  usePostNormal(): this {
    return this.setLogisticsSubType(LogisticsSubType.POST)
  }
}
