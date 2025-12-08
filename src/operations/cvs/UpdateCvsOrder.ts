import { Content } from '../../base/Content.js'
import { LogisticsError } from '../../errors/LogisticsError.js'

export class UpdateCvsOrder extends Content {
  protected requestPath = '/Express/UpdateShipmentInfo'

  constructor(merchantID: string = '', hashKey: string = '', hashIV: string = '') {
    super(merchantID, hashKey, hashIV)
    this.content.ShipmentDate = new Date().toISOString().split('T')[0] // Default to today? PHP doesn't set it by default.
  }

  protected initContent(): void {
    super.initContent()
    // No default parameters for update
  }

  public setAllPayLogisticsID(id: string): this {
    this.content.AllPayLogisticsID = id
    return this
  }

  public setShipmentDate(date: Date | string): this {
    if (date instanceof Date) {
      const yyyy = date.getFullYear()
      const mm = String(date.getMonth() + 1).padStart(2, '0')
      const dd = String(date.getDate()).padStart(2, '0')
      this.content.ShipmentDate = `${yyyy}/${mm}/${dd}`
    } else {
      this.content.ShipmentDate = date
    }
    return this
  }

  public setReceiverStoreID(storeId: string): this {
    this.content.ReceiverStoreID = storeId
    return this
  }

  validate(): void {
    this.validateBaseParam()
    if (!this.content.AllPayLogisticsID) throw LogisticsError.required('AllPayLogisticsID')
  }
}
