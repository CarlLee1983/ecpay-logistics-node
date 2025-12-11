import { Content } from '../base/Content.js'
import { LogisticsSubType, LogisticsSubTypeHelpers } from '../enums/LogisticsSubType.js'
import { StoreType } from '../enums/StoreType.js'
import { LogisticsError } from '../errors/LogisticsError.js'

/**
 * GetStoreList - 查詢門市清單
 *
 * 用於查詢超商門市資訊，可依關鍵字、郵遞區號或城市搜尋。
 *
 * @extends Content
 * @example
 * ```typescript
 * const query = new GetStoreList('merchantID', 'hashKey', 'hashIV')
 *   .searchUnimart()
 *   .byKeyword('台北市信義區')
 *   .pickupOnly()
 *
 * // 或依郵遞區號搜尋
 * const query = new GetStoreList('merchantID', 'hashKey', 'hashIV')
 *   .searchFami()
 *   .byZipCode('110')
 *
 * const content = query.getContent()
 * ```
 */
export class GetStoreList extends Content {
  protected requestPath = '/Express/GetStoreList'

  /**
   * 初始化請求內容，設定預設值
   *
   * @protected
   */
  protected initContent(): void {
    super.initContent()
    this.content.StoreType = StoreType.PICKUP_ONLY
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
    return this
  }

  /**
   * 設定門市類型
   *
   * @param storeType - 門市類型（純取貨/取貨退貨/純退貨）
   * @returns 當前實例，支援鏈式呼叫
   */
  public setStoreType(storeType: StoreType): this {
    this.content.StoreType = storeType
    return this
  }

  /**
   * 設定搜尋關鍵字
   *
   * @param keyword - 搜尋關鍵字（地址或門市名稱）
   * @returns 當前實例，支援鏈式呼叫
   */
  public setKeyword(keyword: string): this {
    this.content.Keyword = keyword
    return this
  }

  /**
   * 設定郵遞區號
   *
   * @param zipCode - 郵遞區號
   * @returns 當前實例，支援鏈式呼叫
   */
  public setZipCode(zipCode: string): this {
    this.content.ZipCode = zipCode
    return this
  }

  /**
   * 設定城市
   *
   * @param city - 城市名稱
   * @returns 當前實例，支援鏈式呼叫
   */
  public setCity(city: string): this {
    this.content.City = city
    return this
  }

  /**
   * 驗證請求內容
   *
   * @throws {LogisticsError} 當必要欄位缺失時
   */
  validate(): void {
    this.validateBaseParam()

    if (!this.content.LogisticsSubType) throw LogisticsError.required('LogisticsSubType')

    const hasSearchCriteria = this.content.Keyword || this.content.ZipCode || this.content.City
    if (!hasSearchCriteria) {
      throw LogisticsError.required('Keyword, ZipCode or City (at least one)')
    }
  }

  // Convenience Methods

  /**
   * 搜尋 7-ELEVEN 門市
   *
   * @param isC2C - 是否為 C2C（預設 true）
   * @returns 當前實例，支援鏈式呼叫
   */
  searchUnimart(isC2C: boolean = true): this {
    return this.setLogisticsSubType(isC2C ? LogisticsSubType.UNIMART_C2C : LogisticsSubType.UNIMART)
  }

  /**
   * 搜尋全家門市
   *
   * @param isC2C - 是否為 C2C（預設 true）
   * @returns 當前實例，支援鏈式呼叫
   */
  searchFami(isC2C: boolean = true): this {
    return this.setLogisticsSubType(isC2C ? LogisticsSubType.FAMI_C2C : LogisticsSubType.FAMI)
  }

  /**
   * 搜尋萊爾富門市
   *
   * @param isC2C - 是否為 C2C（預設 true）
   * @returns 當前實例，支援鏈式呼叫
   */
  searchHilife(isC2C: boolean = true): this {
    return this.setLogisticsSubType(isC2C ? LogisticsSubType.HILIFE_C2C : LogisticsSubType.HILIFE)
  }

  /**
   * 搜尋 OK Mart 門市
   *
   * @returns 當前實例，支援鏈式呼叫
   */
  searchOkmart(): this {
    return this.setLogisticsSubType(LogisticsSubType.OKMART_C2C)
  }

  /**
   * 設定為純取貨門市
   *
   * @returns 當前實例，支援鏈式呼叫
   */
  pickupOnly(): this {
    return this.setStoreType(StoreType.PICKUP_ONLY)
  }

  /**
   * 設定為取貨退貨門市
   *
   * @returns 當前實例，支援鏈式呼叫
   */
  pickupAndReturn(): this {
    return this.setStoreType(StoreType.PICKUP_AND_RETURN)
  }

  /**
   * 設定為純退貨門市
   *
   * @returns 當前實例，支援鏈式呼叫
   */
  returnOnly(): this {
    return this.setStoreType(StoreType.RETURN_ONLY)
  }

  /**
   * 依關鍵字搜尋
   *
   * @param keyword - 搜尋關鍵字
   * @returns 當前實例，支援鏈式呼叫
   */
  byKeyword(keyword: string): this {
    return this.setKeyword(keyword)
  }

  /**
   * 依郵遞區號搜尋
   *
   * @param zipCode - 郵遞區號
   * @returns 當前實例，支援鏈式呼叫
   */
  byZipCode(zipCode: string): this {
    return this.setZipCode(zipCode)
  }

  /**
   * 依城市搜尋
   *
   * @param city - 城市名稱
   * @returns 當前實例，支援鏈式呼叫
   */
  byCity(city: string): this {
    return this.setCity(city)
  }
}
