import { CheckMacEncoder } from '../security/CheckMacEncoder.js'

/**
 * 物流通知結果介面
 *
 * ECPay 物流狀態變更時會透過 ServerReplyURL 傳送此格式的資料。
 */
export interface ILogisticsNotifyResult {
  /** 回傳代碼（1 為成功） */
  RtnCode: string
  /** 回傳訊息 */
  RtnMsg: string
  /** 綠界物流交易編號 */
  AllPayLogisticsID: string
  /** 物流類型 */
  LogisticsType: string
  /** 物流子類型 */
  LogisticsSubType: string
  /** 商品金額 */
  GoodsAmount: number
  /** 狀態更新時間 */
  UpdateStatusDate: string
  /** 收件人姓名 */
  ReceiverName?: string
  /** 收件人電話 */
  ReceiverPhone?: string
  /** 收件人手機 */
  ReceiverCellPhone?: string
  /** 收件人 Email */
  ReceiverEmail?: string
  /** 收件人地址 */
  ReceiverAddress?: string
  /** 寄貨編號 */
  CVSPaymentNo?: string
  /** 驗證碼 */
  CVSValidationNo?: string
  /** 托運單號 */
  BookingNote?: string
  /** 其他欄位 */
  [key: string]: any
}

/**
 * LogisticsNotify - 物流狀態通知處理
 *
 * 用於驗證和解析 ECPay 物流狀態變更通知。
 *
 * @example
 * ```typescript
 * // Express.js 範例
 * app.post('/ecpay/callback', (req, res) => {
 *   const isValid = LogisticsNotify.verify(req.body, 'hashKey', 'hashIV')
 *   if (!isValid) {
 *     return res.status(400).send('0|CheckMacValue Error')
 *   }
 *
 *   const result = LogisticsNotify.parse(req.body)
 *   console.log('物流狀態更新:', result.RtnCode, result.RtnMsg)
 *
 *   res.send('1|OK')
 * })
 * ```
 */
export class LogisticsNotify {
  /**
   * 驗證通知資料的 CheckMacValue
   *
   * @param params - ECPay 傳送的通知資料
   * @param hashKey - HashKey
   * @param hashIV - HashIV
   * @returns 驗證是否通過
   */
  public static verify(params: Record<string, any>, hashKey: string, hashIV: string): boolean {
    const { CheckMacValue, ...rest } = params

    // 重新計算 CheckMacValue
    const encoder = new CheckMacEncoder(hashKey, hashIV)
    const calculatedMac = encoder.generateCheckMacValue(rest)

    return calculatedMac === CheckMacValue
  }

  /**
   * 解析通知資料
   *
   * @param params - ECPay 傳送的通知資料
   * @returns 型別化的通知結果物件
   */
  public static parse(params: Record<string, any>): ILogisticsNotifyResult {
    return params as unknown as ILogisticsNotifyResult
  }
}
