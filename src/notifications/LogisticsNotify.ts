import { CheckMacEncoder } from '../security/CheckMacEncoder.js'

export interface ILogisticsNotifyResult {
  RtnCode: string
  RtnMsg: string
  AllPayLogisticsID: string
  LogisticsType: string
  LogisticsSubType: string
  GoodsAmount: number
  UpdateStatusDate: string
  ReceiverName?: string
  ReceiverPhone?: string
  ReceiverCellPhone?: string
  ReceiverEmail?: string
  ReceiverAddress?: string
  CVSPaymentNo?: string
  CVSValidationNo?: string
  BookingNote?: string
  [key: string]: any
}

export class LogisticsNotify {
  public static verify(params: Record<string, any>, hashKey: string, hashIV: string): boolean {
    const { CheckMacValue, ...rest } = params

    // Recalculate hash
    const encoder = new CheckMacEncoder(hashKey, hashIV)
    const calculatedMac = encoder.generateCheckMacValue(rest)

    return calculatedMac === CheckMacValue
  }

  /**
   * Parse the request body (assuming express/body-parser format)
   * and generic handling
   */
  public static parse(params: Record<string, any>): ILogisticsNotifyResult {
    // Just a pass-through typing helper, mainly.
    return params as unknown as ILogisticsNotifyResult
  }
}
