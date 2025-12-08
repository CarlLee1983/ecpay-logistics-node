import { Content } from '../base/Content.js'
import { LogisticsError } from '../errors/LogisticsError.js'

export class QueryLogisticsOrder extends Content {
  protected requestPath = '/Helper/QueryLogisticsTradeInfo/V4'

  protected initContent(): void {
    super.initContent()
    this.content.TimeStamp = Math.floor(Date.now() / 1000)
  }

  public setAllPayLogisticsID(id: string): this {
    this.content.AllPayLogisticsID = id
    return this
  }

  public setTimeStamp(timestamp: number): this {
    this.content.TimeStamp = timestamp
    return this
  }

  validate(): void {
    this.validateBaseParam()
    if (!this.content.AllPayLogisticsID) throw LogisticsError.required('AllPayLogisticsID')
    if (!this.content.TimeStamp) throw LogisticsError.required('TimeStamp')
  }
}
