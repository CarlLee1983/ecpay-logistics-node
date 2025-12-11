import { CheckMacEncoder } from '../security/CheckMacEncoder.js'
import { LogisticsError } from '../errors/LogisticsError.js'
import { ILogisticsCommand } from '../interfaces/ILogisticsCommand.js'
import { formatECPayDateTime } from '../utils/date.js'

/**
 * Content
 *
 * 所有物流操作和查詢的基礎抽象類別。
 * 提供共用的屬性設定、驗證邏輯和 CheckMacValue 編碼功能。
 *
 * @abstract
 * @implements {ILogisticsCommand}
 * @example
 * ```typescript
 * class MyOperation extends Content {
 *   validate(): void {
 *     this.validateBaseParam()
 *     // 自訂驗證邏輯
 *   }
 * }
 * ```
 */
export abstract class Content implements ILogisticsCommand {
  /** MerchantTradeNo 欄位的最大長度限制 */
  public static readonly MERCHANT_TRADE_NO_MAX_LENGTH = 20

  /** API 請求路徑 */
  protected requestPath = ''

  /** 特約商店編號 */
  protected merchantID = ''

  /** HashKey 用於 CheckMacValue 計算 */
  protected hashKey = ''

  /** HashIV 用於 CheckMacValue 計算 */
  protected hashIV = ''

  /** ECPay API 伺服器網址 */
  protected serverUrl = 'https://logistics-stage.ecpay.com.tw'

  /** 請求內容 */
  protected content: Record<string, any> = {}

  /** CheckMacValue 編碼器實例 */
  protected encoder: CheckMacEncoder | null = null

  /**
   * 建立 Content 實例
   *
   * @param merchantID - 特約商店編號
   * @param hashKey - HashKey
   * @param hashIV - HashIV
   */
  constructor(merchantID: string = '', hashKey: string = '', hashIV: string = '') {
    this.merchantID = merchantID
    this.hashKey = hashKey
    this.hashIV = hashIV

    this.initContent()
  }

  /**
   * 初始化請求內容
   * 子類別可覆寫此方法以設定預設值
   *
   * @protected
   */
  protected initContent(): void {
    this.content = {
      MerchantID: this.merchantID,
    }
  }

  // Setters

  /**
   * 設定特約商店編號
   *
   * @param id - 特約商店編號
   * @returns 當前實例，支援鏈式呼叫
   */
  public setMerchantID(id: string): this {
    this.merchantID = id
    this.content.MerchantID = id
    return this
  }

  /**
   * 取得特約商店編號
   *
   * @returns 特約商店編號
   */
  public getMerchantID(): string {
    return this.merchantID
  }

  /**
   * 設定 HashKey
   *
   * @param key - HashKey
   * @returns 當前實例，支援鏈式呼叫
   */
  public setHashKey(key: string): this {
    this.hashKey = key
    return this
  }

  /**
   * 設定 HashIV
   *
   * @param iv - HashIV
   * @returns 當前實例，支援鏈式呼叫
   */
  public setHashIV(iv: string): this {
    this.hashIV = iv
    return this
  }

  /**
   * 設定平台商編號（選填）
   *
   * @param id - 平台商編號
   * @returns 當前實例，支援鏈式呼叫
   */
  public setPlatformID(id: string): this {
    if (id) {
      this.content.PlatformID = id
    }
    return this
  }

  /**
   * 設定廠商交易編號
   *
   * @param tradeNo - 廠商交易編號（最多 20 字元）
   * @returns 當前實例，支援鏈式呼叫
   * @throws {LogisticsError} 當長度超過限制時
   */
  public setMerchantTradeNo(tradeNo: string): this {
    if (tradeNo.length > Content.MERCHANT_TRADE_NO_MAX_LENGTH) {
      throw LogisticsError.tooLong('MerchantTradeNo', Content.MERCHANT_TRADE_NO_MAX_LENGTH)
    }
    this.content.MerchantTradeNo = tradeNo
    return this
  }

  /**
   * 設定廠商交易日期時間
   *
   * @param date - 日期物件或格式化字串 (YYYY/MM/DD HH:mm:ss)
   * @returns 當前實例，支援鏈式呼叫
   */
  public setMerchantTradeDate(date: Date | string): this {
    if (date instanceof Date) {
      this.content.MerchantTradeDate = formatECPayDateTime(date)
    } else {
      this.content.MerchantTradeDate = date
    }
    return this
  }

  /**
   * 設定伺服器回覆網址
   *
   * @param url - 接收 ECPay 通知的伺服器網址
   * @returns 當前實例，支援鏈式呼叫
   */
  public setServerReplyURL(url: string): this {
    this.content.ServerReplyURL = url
    return this
  }

  /**
   * 設定客戶端回覆網址
   *
   * @param url - 客戶端導向網址
   * @returns 當前實例，支援鏈式呼叫
   */
  public setClientReplyURL(url: string): this {
    this.content.ClientReplyURL = url
    return this
  }

  /**
   * 設定備註
   *
   * @param remark - 備註內容
   * @returns 當前實例，支援鏈式呼叫
   */
  public setRemark(remark: string): this {
    this.content.Remark = remark
    return this
  }

  /**
   * 設定 ECPay API 伺服器網址
   *
   * @param url - 伺服器網址（正式環境或測試環境）
   * @returns 當前實例，支援鏈式呼叫
   */
  public setServerUrl(url: string): this {
    this.serverUrl = url.replace(/\/$/, '')
    return this
  }

  /**
   * 取得 API 請求路徑
   *
   * @returns API 請求路徑
   */
  public getRequestPath(): string {
    return this.requestPath
  }

  /**
   * 取得 CheckMacValue 編碼器
   * 若尚未建立則自動建立新實例
   *
   * @returns CheckMacEncoder 實例
   */
  public getEncoder(): CheckMacEncoder {
    if (!this.encoder) {
      this.encoder = new CheckMacEncoder(this.hashKey, this.hashIV)
    }
    return this.encoder
  }

  /**
   * 設定 CheckMacValue 編碼器
   *
   * @param encoder - CheckMacEncoder 實例
   * @returns 當前實例，支援鏈式呼叫
   */
  public setEncoder(encoder: CheckMacEncoder): this {
    this.encoder = encoder
    return this
  }

  /**
   * 驗證請求內容
   * 子類別必須實作此方法以定義驗證邏輯
   *
   * @abstract
   * @throws {LogisticsError} 當驗證失敗時
   */
  abstract validate(): void

  /**
   * 驗證基本必要參數
   *
   * @protected
   * @throws {LogisticsError} 當必要參數缺失時
   */
  protected validateBaseParam(): void {
    if (!this.merchantID) throw LogisticsError.required('MerchantID')
    if (!this.hashKey) throw LogisticsError.required('HashKey')
    if (!this.hashIV) throw LogisticsError.required('HashIV')
  }

  /**
   * 取得未簽章的請求內容
   *
   * @returns 請求內容物件
   * @throws {LogisticsError} 當驗證失敗時
   */
  public getPayload(): Record<string, any> {
    this.validate()
    this.content.MerchantID = this.merchantID
    return this.content
  }

  /**
   * 取得已簽章的請求內容（包含 CheckMacValue）
   *
   * @returns 包含 CheckMacValue 的請求內容物件
   * @throws {LogisticsError} 當驗證失敗時
   */
  public getContent(): Record<string, any> {
    const payload = this.getPayload()
    const encoder = this.getEncoder()
    return encoder.encodePayload(payload)
  }
}
