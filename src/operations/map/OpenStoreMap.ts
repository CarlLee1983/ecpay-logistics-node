import { Content } from '../../base/Content.js'
import { LogisticsError } from '../../errors/LogisticsError.js'
import { LogisticsType } from '../../enums/LogisticsType.js'
import { LogisticsSubType, LogisticsSubTypeHelpers } from '../../enums/LogisticsSubType.js'
import { IsCollection } from '../../enums/IsCollection.js'
import { Device } from '../../enums/Device.js'

/**
 * OpenStoreMap - 開啟門市地圖選擇器
 *
 * 用於產生開啟 ECPay 門市選擇地圖的請求參數。
 * 使用者可透過地圖介面選擇取貨門市。
 *
 * @extends Content
 * @example
 * ```typescript
 * const map = new OpenStoreMap('merchantID', 'hashKey', 'hashIV')
 *   .useUnimartC2C()
 *   .setMerchantTradeNo('ORDER001')
 *   .setServerReplyURL('https://example.com/callback')
 *   .usePCDevice()
 *
 * const content = map.getContent()
 * ```
 */
export class OpenStoreMap extends Content {
  protected requestPath = '/Express/map'

  /**
   * 初始化請求內容，設定預設值
   *
   * @protected
   */
  protected initContent(): void {
    super.initContent()
    this.content.LogisticsType = LogisticsType.CVS
    this.content.LogisticsSubType = LogisticsSubType.UNIMART_C2C
    this.content.IsCollection = IsCollection.NO
    this.content.Device = Device.PC
  }

  /**
   * 設定物流子類型
   *
   * @param subType - 物流子類型
   * @returns 當前實例，支援鏈式呼叫
   */
  public setLogisticsSubType(subType: LogisticsSubType): this {
    this.content.LogisticsSubType = subType
    // 自動設定對應的 LogisticsType
    if (LogisticsSubTypeHelpers.isHome(subType)) {
      this.content.LogisticsType = LogisticsType.HOME
    } else {
      this.content.LogisticsType = LogisticsType.CVS
    }
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
   * 設定裝置類型
   *
   * @param device - 裝置類型（PC 或 MOBILE）
   * @returns 當前實例，支援鏈式呼叫
   */
  public setDevice(device: Device): this {
    this.content.Device = device
    return this
  }

  /**
   * 設定額外資料
   *
   * @param data - 額外資料（會在回傳時原樣返回）
   * @returns 當前實例，支援鏈式呼叫
   */
  public setExtraData(data: string): this {
    this.content.ExtraData = data
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
    if (!this.content.LogisticsType) throw LogisticsError.required('LogisticsType')
    if (!this.content.LogisticsSubType) throw LogisticsError.required('LogisticsSubType')
    if (!this.content.ServerReplyURL) throw LogisticsError.required('ServerReplyURL')
  }

  // Convenience Methods

  /**
   * 使用 7-ELEVEN C2C
   *
   * @returns 當前實例，支援鏈式呼叫
   */
  useUnimartC2C(): this {
    return this.setLogisticsSubType(LogisticsSubType.UNIMART_C2C)
  }

  /**
   * 使用全家 C2C
   *
   * @returns 當前實例，支援鏈式呼叫
   */
  useFamiC2C(): this {
    return this.setLogisticsSubType(LogisticsSubType.FAMI_C2C)
  }

  /**
   * 使用萊爾富 C2C
   *
   * @returns 當前實例，支援鏈式呼叫
   */
  useHilifeC2C(): this {
    return this.setLogisticsSubType(LogisticsSubType.HILIFE_C2C)
  }

  /**
   * 使用 OK Mart C2C
   *
   * @returns 當前實例，支援鏈式呼叫
   */
  useOkmartC2C(): this {
    return this.setLogisticsSubType(LogisticsSubType.OKMART_C2C)
  }

  /**
   * 使用 7-ELEVEN B2C
   *
   * @returns 當前實例，支援鏈式呼叫
   */
  useUnimartB2C(): this {
    return this.setLogisticsSubType(LogisticsSubType.UNIMART)
  }

  /**
   * 使用全家 B2C
   *
   * @returns 當前實例，支援鏈式呼叫
   */
  useFamiB2C(): this {
    return this.setLogisticsSubType(LogisticsSubType.FAMI)
  }

  /**
   * 使用萊爾富 B2C
   *
   * @returns 當前實例，支援鏈式呼叫
   */
  useHilifeB2C(): this {
    return this.setLogisticsSubType(LogisticsSubType.HILIFE)
  }

  /**
   * 使用 PC 版本介面
   *
   * @returns 當前實例，支援鏈式呼叫
   */
  usePCDevice(): this {
    return this.setDevice(Device.PC)
  }

  /**
   * 使用手機版本介面
   *
   * @returns 當前實例，支援鏈式呼叫
   */
  useMobileDevice(): this {
    return this.setDevice(Device.MOBILE)
  }
}
