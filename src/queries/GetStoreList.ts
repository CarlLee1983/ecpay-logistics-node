import { Content } from '../base/Content.js'
import { LogisticsError } from '../errors/LogisticsError.js'
import { LogisticsSubType, LogisticsSubTypeHelpers } from '../enums/LogisticsSubType.js'
import { StoreType } from '../enums/StoreType.js'

export class GetStoreList extends Content {
  protected requestPath = '/Express/GetStoreList'

  protected initContent(): void {
    super.initContent()
    this.content.StoreType = StoreType.PICKUP_ONLY
  }

  public setLogisticsSubType(subType: LogisticsSubType): this {
    if (!LogisticsSubTypeHelpers.isCvs(subType)) {
      throw LogisticsError.invalid('LogisticsSubType', 'Must be a CVS type')
    }
    this.content.LogisticsSubType = subType
    return this
  }

  public setStoreType(storeType: StoreType): this {
    this.content.StoreType = storeType
    return this
  }

  public setKeyword(keyword: string): this {
    this.content.Keyword = keyword
    return this
  }

  public setZipCode(zipCode: string): this {
    this.content.ZipCode = zipCode
    return this
  }

  public setCity(city: string): this {
    this.content.City = city
    return this
  }

  validate(): void {
    this.validateBaseParam()

    if (!this.content.LogisticsSubType) throw LogisticsError.required('LogisticsSubType')

    const hasSearchCriteria = this.content.Keyword || this.content.ZipCode || this.content.City
    if (!hasSearchCriteria) {
      throw LogisticsError.required('Keyword, ZipCode or City (at least one)')
    }
  }

  // Convenience Methods
  searchUnimart(isC2C: boolean = true): this {
    return this.setLogisticsSubType(isC2C ? LogisticsSubType.UNIMART_C2C : LogisticsSubType.UNIMART)
  }

  searchFami(isC2C: boolean = true): this {
    return this.setLogisticsSubType(isC2C ? LogisticsSubType.FAMI_C2C : LogisticsSubType.FAMI)
  }

  searchHilife(isC2C: boolean = true): this {
    return this.setLogisticsSubType(isC2C ? LogisticsSubType.HILIFE_C2C : LogisticsSubType.HILIFE)
  }

  searchOkmart(): this {
    return this.setLogisticsSubType(LogisticsSubType.OKMART_C2C)
  }

  pickupOnly(): this {
    return this.setStoreType(StoreType.PICKUP_ONLY)
  }
  pickupAndReturn(): this {
    return this.setStoreType(StoreType.PICKUP_AND_RETURN)
  }
  returnOnly(): this {
    return this.setStoreType(StoreType.RETURN_ONLY)
  }

  byKeyword(keyword: string): this {
    return this.setKeyword(keyword)
  }
  byZipCode(zipCode: string): this {
    return this.setZipCode(zipCode)
  }
  byCity(city: string): this {
    return this.setCity(city)
  }
}
