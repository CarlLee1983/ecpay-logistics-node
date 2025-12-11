import { parseLogisticsNotify, verifyLogisticsNotify } from './LogisticsNotify.js'

/**
 * ReturnLogisticsNotify - 逆物流狀態通知處理
 *
 * 用於驗證和解析 ECPay 逆物流（退貨）狀態變更通知。
 * 使用與 LogisticsNotify 相同的 CheckMacValue 驗證邏輯。
 *
 * @example
 * ```typescript
 * // Express.js 範例
 * import { ReturnLogisticsNotify } from 'ecpay-logistics-node'
 *
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
export const ReturnLogisticsNotify = {
  verify: verifyLogisticsNotify,
  parse: parseLogisticsNotify,
}
