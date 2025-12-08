import { Content } from '../../base/Content.js'
import { LogisticsError } from '../../errors/LogisticsError.js'
import { LogisticsType } from '../../enums/LogisticsType.js'
import { LogisticsSubType, LogisticsSubTypeHelpers } from '../../enums/LogisticsSubType.js'
import { IsCollection } from '../../enums/IsCollection.js'
import { Device } from '../../enums/Device.js'

export class OpenStoreMap extends Content {
  protected requestPath = '/Express/map'

  protected initContent(): void {
    super.initContent()
    this.content.LogisticsType = LogisticsType.CVS
    this.content.LogisticsSubType = LogisticsSubType.UNIMART_C2C
    this.content.IsCollection = IsCollection.NO
    this.content.Device = Device.PC
  }

  public setLogisticsSubType(subType: LogisticsSubType): this {
    this.content.LogisticsSubType = subType
    // Automatically set LogisticsType based on subType, but here only CVS supported for map usually?
    // PHP `getLogisticsType()` logic:
    if (LogisticsSubTypeHelpers.isHome(subType)) {
      this.content.LogisticsType = LogisticsType.HOME
    } else {
      this.content.LogisticsType = LogisticsType.CVS
    }
    return this
  }

  public setIsCollection(isCollection: IsCollection): this {
    this.content.IsCollection = isCollection
    return this
  }

  public setDevice(device: Device): this {
    this.content.Device = device
    return this
  }

  public setExtraData(data: string): this {
    this.content.ExtraData = data
    return this
  }

  validate(): void {
    this.validateBaseParam()
    if (!this.content.MerchantTradeNo) throw LogisticsError.required('MerchantTradeNo')
    if (!this.content.LogisticsType) throw LogisticsError.required('LogisticsType')
    if (!this.content.LogisticsSubType) throw LogisticsError.required('LogisticsSubType')
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

  usePCDevice(): this {
    return this.setDevice(Device.PC)
  }
  useMobileDevice(): this {
    return this.setDevice(Device.MOBILE)
  }
}
