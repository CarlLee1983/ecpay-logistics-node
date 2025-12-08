import { CheckMacEncoder } from '../security/CheckMacEncoder.js'
import { LogisticsError } from '../errors/LogisticsError.js'
import { ILogisticsCommand } from '../interfaces/ILogisticsCommand.js'

/**
 * Content
 *
 * Base abstract class for all Logistics Operations and Queries.
 */
export abstract class Content implements ILogisticsCommand {
  public static readonly MERCHANT_TRADE_NO_MAX_LENGTH = 20

  protected requestPath = ''
  protected merchantID = ''
  protected hashKey = ''
  protected hashIV = ''
  protected serverUrl = 'https://logistics-stage.ecpay.com.tw'

  protected content: Record<string, any> = {}
  protected encoder: CheckMacEncoder | null = null

  constructor(merchantID: string = '', hashKey: string = '', hashIV: string = '') {
    this.merchantID = merchantID
    this.hashKey = hashKey
    this.hashIV = hashIV

    this.initContent()
  }

  protected initContent(): void {
    this.content = {
      MerchantID: this.merchantID,
    }
  }

  // Setters

  public setMerchantID(id: string): this {
    this.merchantID = id
    this.content.MerchantID = id
    return this
  }

  public getMerchantID(): string {
    return this.merchantID
  }

  public setHashKey(key: string): this {
    this.hashKey = key
    return this
  }

  public setHashIV(iv: string): this {
    this.hashIV = iv
    return this
  }

  public setPlatformID(id: string): this {
    if (id) {
      this.content.PlatformID = id
    }
    return this
  }

  public setMerchantTradeNo(tradeNo: string): this {
    if (tradeNo.length > Content.MERCHANT_TRADE_NO_MAX_LENGTH) {
      throw LogisticsError.tooLong('MerchantTradeNo', Content.MERCHANT_TRADE_NO_MAX_LENGTH)
    }
    this.content.MerchantTradeNo = tradeNo
    return this
  }

  public setMerchantTradeDate(date: Date | string): this {
    if (date instanceof Date) {
      const yyyy = date.getFullYear()
      const mm = String(date.getMonth() + 1).padStart(2, '0')
      const dd = String(date.getDate()).padStart(2, '0')
      const hh = String(date.getHours()).padStart(2, '0')
      const ii = String(date.getMinutes()).padStart(2, '0')
      const ss = String(date.getSeconds()).padStart(2, '0')
      this.content.MerchantTradeDate = `${yyyy}/${mm}/${dd} ${hh}:${ii}:${ss}`
    } else {
      this.content.MerchantTradeDate = date
    }
    return this
  }

  public setServerReplyURL(url: string): this {
    this.content.ServerReplyURL = url
    return this
  }

  public setClientReplyURL(url: string): this {
    this.content.ClientReplyURL = url
    return this
  }

  public setRemark(remark: string): this {
    this.content.Remark = remark
    return this
  }

  public setServerUrl(url: string): this {
    this.serverUrl = url.replace(/\/$/, '')
    return this
  }

  public getRequestPath(): string {
    return this.requestPath
  }

  public getEncoder(): CheckMacEncoder {
    if (!this.encoder) {
      this.encoder = new CheckMacEncoder(this.hashKey, this.hashIV)
    }
    return this.encoder
  }

  public setEncoder(encoder: CheckMacEncoder): this {
    this.encoder = encoder
    return this
  }

  abstract validate(): void

  protected validateBaseParam(): void {
    if (!this.merchantID) throw LogisticsError.required('MerchantID')
    if (!this.hashKey) throw LogisticsError.required('HashKey')
    if (!this.hashIV) throw LogisticsError.required('HashIV')
  }

  public getPayload(): Record<string, any> {
    this.validate()
    this.content.MerchantID = this.merchantID
    return this.content
  }

  public getContent(): Record<string, any> {
    const payload = this.getPayload()
    const encoder = this.getEncoder()
    return encoder.encodePayload(payload)
  }
}
