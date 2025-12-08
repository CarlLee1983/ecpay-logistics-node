import { describe, expect, it } from 'bun:test'
import { LogisticsNotify } from '../src/notifications/LogisticsNotify.js'
import { CheckMacEncoder } from '../src/security/CheckMacEncoder.js'

describe('Notifications', () => {
  describe('LogisticsNotify', () => {
    const hashKey = '5294y06JbISpM5x9'
    const hashIV = 'v77hoKGq4kWxNNIS'
    const encoder = new CheckMacEncoder(hashKey, hashIV)

    it('should verify valid notification payload', () => {
      const data: any = {
        MerchantID: '2000132',
        MerchantTradeNo: 'Test123456',
        RtnCode: '1',
        RtnMsg: 'Success',
        LogisticsType: 'CVS',
        LogisticsSubType: 'UNIMART',
      }
      // Generate valid Mac
      data.CheckMacValue = encoder.generateCheckMacValue(data)

      // If verify is static
      const result = LogisticsNotify.verify(data, hashKey, hashIV)

      expect(result).toBeTrue()
    })

    it('should return false for invalid checksum', () => {
      const data: any = {
        MerchantID: '2000132',
        CheckMacValue: 'INVALID',
      }

      const result = LogisticsNotify.verify(data, hashKey, hashIV)

      expect(result).toBeFalse()
    })
    it('should parse raw body to interface', () => {
      const rawBody = {
        RtnCode: '1',
        RtnMsg: 'Success',
        AllPayLogisticsID: '12345',
        LogisticsType: 'CVS',
        LogisticsSubType: 'UNIMART',
        GoodsAmount: 100,
        UpdateStatusDate: '2025/12/08 10:00:00',
        UnknownField: 'Test',
      }

      const result = LogisticsNotify.parse(rawBody)
      expect(result.RtnCode).toBe('1')
      expect(result.GoodsAmount).toBe(100)
      expect(result.UnknownField).toBe('Test')
    })
  })
})
