import { Content } from '../base/Content.js'
import { LogisticsError } from '../errors/LogisticsError.js'
import { LogisticsSubType } from '../enums/LogisticsSubType.js'

export class PrintTradeDocument extends Content {
  protected requestPath = '/helper/printTradeDocument'
  protected allPayLogisticsIDs: string[] = []

  public setAllPayLogisticsID(id: string): this {
    this.allPayLogisticsIDs = [id]
    this.content.AllPayLogisticsID = id
    return this
  }

  public setAllPayLogisticsIDs(ids: string[]): this {
    this.allPayLogisticsIDs = ids
    this.content.AllPayLogisticsID = ids.join(',')
    return this
  }

  public addLogisticsID(id: string): this {
    this.allPayLogisticsIDs.push(id)
    this.content.AllPayLogisticsID = this.allPayLogisticsIDs.join(',')
    return this
  }

  public setLogisticsSubType(subType: LogisticsSubType): this {
    if (
      [
        LogisticsSubType.UNIMART_C2C,
        LogisticsSubType.FAMI_C2C,
        LogisticsSubType.HILIFE_C2C,
        LogisticsSubType.OKMART_C2C,
      ].includes(subType)
    ) {
      throw LogisticsError.invalid('LogisticsSubType', 'Please use PrintCvsDocument for C2C orders')
    }

    this.content.LogisticsSubType = subType
    return this
  }

  validate(): void {
    this.validateBaseParam()
    if (this.allPayLogisticsIDs.length === 0) throw LogisticsError.required('AllPayLogisticsID')
  }

  // Convenience Methods
  useUnimartB2C(): this {
    return this.setLogisticsSubType(LogisticsSubType.UNIMART)
  }
  useFamiB2C(): this {
    return this.setLogisticsSubType(LogisticsSubType.FAMI)
  }
  useHilifeB2C(): this {
    return this.setLogisticsSubType(LogisticsSubType.HILIFE)
  }
  useTcat(): this {
    return this.setLogisticsSubType(LogisticsSubType.TCAT)
  }
  usePost(): this {
    return this.setLogisticsSubType(LogisticsSubType.POST)
  }
}
