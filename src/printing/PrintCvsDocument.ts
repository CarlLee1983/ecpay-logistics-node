import { Content } from '../base/Content.js'
import { LogisticsError } from '../errors/LogisticsError.js'
import { LogisticsSubType } from '../enums/LogisticsSubType.js'

/**
 * PrintCvsDocument - 列印超商 C2C 取貨單
 *
 * 用於列印 C2C（店到店）超商取貨的寄貨單/託運單。
 *
 * 注意：此類別僅支援 C2C 訂單，B2C 訂單請使用 PrintTradeDocument。
 *
 * @extends Content
 * @example
 * ```typescript
 * // 7-ELEVEN
 * const print = new PrintCvsDocument('merchantID', 'hashKey', 'hashIV')
 *   .forUnimart('F1234567', '1234')
 *
 * // 全家、萊爾富、OK
 * const print = new PrintCvsDocument('merchantID', 'hashKey', 'hashIV')
 *   .useFamiC2C()
 *   .setAllPayLogisticsID('1234567890')
 *
 * const content = print.getContent()
 * ```
 */
export class PrintCvsDocument extends Content {
  protected requestPath = '/Express/PrintUniMartC2COrderInfo' // 預設值，會依類型動態調整
  protected allPayLogisticsIDs: string[] = []
  protected cvsPaymentNos: string[] = []
  protected cvsValidationNos: string[] = []

  /**
   * 設定物流子類型
   *
   * @param subType - 超商物流子類型（僅支援 C2C 類型）
   * @returns 當前實例，支援鏈式呼叫
   * @throws {LogisticsError} 當類型不是 C2C 類型時
   */
  public setLogisticsSubType(subType: LogisticsSubType): this {
    if (
      ![
        LogisticsSubType.UNIMART_C2C,
        LogisticsSubType.FAMI_C2C,
        LogisticsSubType.HILIFE_C2C,
        LogisticsSubType.OKMART_C2C,
      ].includes(subType)
    ) {
      throw LogisticsError.invalid(
        'LogisticsSubType',
        'Please use PrintTradeDocument for B2C/Home orders'
      )
    }

    this.content.LogisticsSubType = subType

    // 依據類型設定對應的 API 路徑
    switch (subType) {
      case LogisticsSubType.UNIMART_C2C:
        this.requestPath = '/Express/PrintUniMartC2COrderInfo'
        break
      case LogisticsSubType.FAMI_C2C:
        this.requestPath = '/Express/PrintFAMIC2COrderInfo'
        break
      case LogisticsSubType.HILIFE_C2C:
        this.requestPath = '/Express/PrintHILIFEC2COrderInfo'
        break
      case LogisticsSubType.OKMART_C2C:
        this.requestPath = '/Express/PrintOKMARTC2COrderInfo'
        break
    }
    return this
  }

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
   * 設定寄貨編號（單筆）
   *
   * @param no - CVSPaymentNo
   * @returns 當前實例，支援鏈式呼叫
   */
  public setCVSPaymentNo(no: string): this {
    this.cvsPaymentNos = [no]
    this.content.CVSPaymentNo = no
    return this
  }

  /**
   * 設定寄貨編號（多筆）
   *
   * @param nos - CVSPaymentNo 陣列
   * @returns 當前實例，支援鏈式呼叫
   */
  public setCVSPaymentNos(nos: string[]): this {
    this.cvsPaymentNos = nos
    this.content.CVSPaymentNo = nos.join(',')
    return this
  }

  /**
   * 設定驗證碼（單筆）
   *
   * @param no - CVSValidationNo
   * @returns 當前實例，支援鏈式呼叫
   */
  public setCVSValidationNo(no: string): this {
    this.cvsValidationNos = [no]
    this.content.CVSValidationNo = no
    return this
  }

  /**
   * 設定驗證碼（多筆）
   *
   * @param nos - CVSValidationNo 陣列
   * @returns 當前實例，支援鏈式呼叫
   */
  public setCVSValidationNos(nos: string[]): this {
    this.cvsValidationNos = nos
    this.content.CVSValidationNo = nos.join(',')
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

    const subType = this.content.LogisticsSubType as LogisticsSubType

    // 7-ELEVEN 需要 CVSPaymentNo 和 CVSValidationNo
    if (subType === LogisticsSubType.UNIMART_C2C) {
      if (this.cvsPaymentNos.length === 0) throw LogisticsError.required('CVSPaymentNo')
      if (this.cvsValidationNos.length === 0) throw LogisticsError.required('CVSValidationNo')
    } else {
      // 其他超商需要 AllPayLogisticsID
      if (this.allPayLogisticsIDs.length === 0) throw LogisticsError.required('AllPayLogisticsID')
    }
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
   * 快速設定 7-ELEVEN 列印所需資訊
   *
   * @param paymentNo - 寄貨編號
   * @param validationNo - 驗證碼
   * @returns 當前實例，支援鏈式呼叫
   */
  forUnimart(paymentNo: string, validationNo: string): this {
    return this.useUnimartC2C().setCVSPaymentNo(paymentNo).setCVSValidationNo(validationNo)
  }
}
