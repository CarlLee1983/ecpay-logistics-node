import { Content } from '../../base/Content.js'
import { LogisticsError } from '../../errors/LogisticsError.js'

export class CancelCvsOrder extends Content {
  protected requestPath = '/Express/CancelCVS'

  public setAllPayLogisticsID(id: string): this {
    this.content.AllPayLogisticsID = id
    return this
  }

  public setCVSPaymentNo(no: string): this {
    this.content.CVSPaymentNo = no
    return this
  }

  public setCVSValidationNo(no: string): this {
    this.content.CVSValidationNo = no
    return this
  }

  validate(): void {
    this.validateBaseParam()

    if (!this.content.AllPayLogisticsID) throw LogisticsError.required('AllPayLogisticsID')
    if (!this.content.CVSPaymentNo) throw LogisticsError.required('CVSPaymentNo')
    if (!this.content.CVSValidationNo) throw LogisticsError.required('CVSValidationNo')
  }
}
