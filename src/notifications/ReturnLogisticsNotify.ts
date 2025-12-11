import { LogisticsNotify } from './LogisticsNotify.js'

/**
 * ReturnLogisticsNotify - 逆物流狀態通知處理
 *
 * 用於驗證和解析 ECPay 逆物流（退貨）狀態變更通知。
 * 繼承自 LogisticsNotify，CheckMacValue 驗證邏輯相同。
 *
 * @extends LogisticsNotify
 * @example
 * ```typescript
 * // Express.js 範例
 * app.post('/ecpay/return-callback', (req, res) => {
 *   const isValid = ReturnLogisticsNotify.verify(req.body, 'hashKey', 'hashIV')
 *   if (!isValid) {
 *     return res.status(400).send('0|CheckMacValue Error')
 *   }
 *
 *   const result = ReturnLogisticsNotify.parse(req.body)
 *   console.log('逆物流狀態更新:', result.RtnCode, result.RtnMsg)
 *
 *   res.send('1|OK')
 * })
 * ```
 */
export class ReturnLogisticsNotify extends LogisticsNotify {
  // 繼承 verify 和 parse 靜態方法
  // 若逆物流有不同的處理邏輯，可在此覆寫
}
