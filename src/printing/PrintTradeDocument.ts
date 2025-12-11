import { Content } from '../base/Content.js'
import { LogisticsSubType } from '../enums/LogisticsSubType.js'
import { LogisticsError } from '../errors/LogisticsError.js'

/**
 * PrintTradeDocument - 列印 B2C/宅配 託運單
 *
 * 用於列印 B2C（廠商到店）超商取貨或宅配的託運單。
 *
 * 注意：此類別不支援 C2C 訂單，C2C 訂單請使用 PrintCvsDocument。
 *
 * @extends Content
 * @example
 * ```typescript
 * const print = new PrintTradeDocument('merchantID', 'hashKey', 'hashIV')
 *   .useUnimartB2C()
 *   .setAllPayLogisticsID('1234567890')
 *
 * // 或批次列印多筆
 * const print = new PrintTradeDocument('merchantID', 'hashKey', 'hashIV')
 *   .useTcat()
 *   .setAllPayLogisticsIDs(['1234567890', '1234567891'])
 *
 * const content = print.getContent()
 * ```
 */
export class PrintTradeDocument extends Content {
  protected requestPath = '/helper/printTradeDocument'
  protected allPayLogisticsIDs: string[] = []

  /**
   * 設定綠界物流交易編號（單筆）
   *
   * @param id - AllPayLogisticsID
   * @returns 當前實例，支援鏈式呼叫
   */
  public setAllPayLogisticsID(id: string): this {
    this.allPayLogisticsIDs = [id]
    this.content.AllPayLogisticsID = id
    return this
  }

  /**
   * 設定綠界物流交易編號（多筆）
   *
   * @param ids - AllPayLogisticsID 陣列
   * @returns 當前實例，支援鏈式呼叫
   */
  public setAllPayLogisticsIDs(ids: string[]): this {
    this.allPayLogisticsIDs = ids
    this.content.AllPayLogisticsID = ids.join(',')
    return this
  }

  /**
   * 新增一筆綠界物流交易編號
   *
   * @param id - AllPayLogisticsID
   * @returns 當前實例，支援鏈式呼叫
   */
  public addLogisticsID(id: string): this {
    this.allPayLogisticsIDs.push(id)
    this.content.AllPayLogisticsID = this.allPayLogisticsIDs.join(',')
    return this
  }

  /**
   * 設定物流子類型
   *
   * @param subType - 物流子類型（不支援 C2C 類型）
   * @returns 當前實例，支援鏈式呼叫
   * @throws {LogisticsError} 當類型是 C2C 類型時
   */
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

  /**
   * 驗證請求內容
   *
   * @throws {LogisticsError} 當必要欄位缺失時
   */
  validate(): void {
    this.validateBaseParam()
    if (this.allPayLogisticsIDs.length === 0) throw LogisticsError.required('AllPayLogisticsID')
  }

  // Convenience Methods

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
  usePost(): this {
    return this.setLogisticsSubType(LogisticsSubType.POST)
  }
}
