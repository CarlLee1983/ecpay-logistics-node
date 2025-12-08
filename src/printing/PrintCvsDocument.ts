import { Content } from '../base/Content.js'
import { LogisticsError } from '../errors/LogisticsError.js'
import { LogisticsSubType } from '../enums/LogisticsSubType.js'

export class PrintCvsDocument extends Content {
  protected requestPath = '/Express/PrintUniMartC2COrderInfo' // Default, changed dynamically
  protected allPayLogisticsIDs: string[] = []
  protected cvsPaymentNos: string[] = []
  protected cvsValidationNos: string[] = []

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

    // Set path based on type
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

  public setCVSPaymentNo(no: string): this {
    this.cvsPaymentNos = [no]
    this.content.CVSPaymentNo = no
    return this
  }

  public setCVSPaymentNos(nos: string[]): this {
    this.cvsPaymentNos = nos
    this.content.CVSPaymentNo = nos.join(',')
    return this
  }

  public setCVSValidationNo(no: string): this {
    this.cvsValidationNos = [no]
    this.content.CVSValidationNo = no
    return this
  }

  public setCVSValidationNos(nos: string[]): this {
    this.cvsValidationNos = nos
    this.content.CVSValidationNo = nos.join(',')
    return this
  }

  validate(): void {
    this.validateBaseParam()
    if (!this.content.LogisticsSubType) throw LogisticsError.required('LogisticsSubType')

    const subType = this.content.LogisticsSubType as LogisticsSubType

    if (subType === LogisticsSubType.UNIMART_C2C) {
      if (this.cvsPaymentNos.length === 0) throw LogisticsError.required('CVSPaymentNo')
      if (this.cvsValidationNos.length === 0) throw LogisticsError.required('CVSValidationNo')
    } else {
      if (this.allPayLogisticsIDs.length === 0) throw LogisticsError.required('AllPayLogisticsID')
    }
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

  forUnimart(paymentNo: string, validationNo: string): this {
    return this.useUnimartC2C().setCVSPaymentNo(paymentNo).setCVSValidationNo(validationNo)
  }
}
