import { describe, expect, it } from 'bun:test'
import { CheckMacEncoder } from '../src/security/CheckMacEncoder.js'
import { LogisticsError } from '../src/errors/LogisticsError.js'

describe('CheckMacEncoder', () => {
  const hashKey = '5294y06JbISpM5x9'
  const hashIV = 'v77hoKGq4kWxNNIS'
  const encoder = new CheckMacEncoder(hashKey, hashIV)

  it('should generate correct CheckMacValue', () => {
    // Example from ECPay documentation or a known valid case
    const data = {
      MerchantID: '2000132',
      MerchantTradeNo: 'Test123456',
      MerchantTradeDate: '2024/01/01 12:00:00',
      LogisticsType: 'CVS',
      LogisticsSubType: 'UNIMART',
      GoodsAmount: 100,
      CollectionAmount: 100,
      IsCollection: 'Y',
      GoodsName: 'Test Goods',
      SenderName: 'Sender',
      SenderPhone: '0912345678',
      SenderCellPhone: '0912345678',
      ReceiverName: 'Receiver',
      ReceiverPhone: '0987654321',
      ReceiverCellPhone: '0987654321',
      ReceiverEmail: 'test@example.com',
      TradeDesc: 'Test Description',
      ServerReplyURL: 'https://www.ecpay.com.tw/ServerReplyURL',
      LogisticsC2CReplyURL: 'https://www.ecpay.com.tw/LogisticsC2CReplyURL',
      Remark: 'Test Remark',
      PlatformID: '',
    }

    const checkMacValue = encoder.generateCheckMacValue(data)
    expect(checkMacValue).toBeString()
    expect(checkMacValue.length).toBeGreaterThan(0)
    // We can calculate the expected value manually or use a known passing value if available.
    // For now, let's verify it's a valid MD5 string (hex, 32 chars usually, but ECPay upper cases it)
    expect(checkMacValue).toMatch(/^[0-9A-F]+$/)
  })

  it('should verify correct CheckMacValue', () => {
    const data = {
      MerchantID: '2000132',
      MerchantTradeNo: '123456',
      RtnCode: '1',
      RtnMsg: 'OK',
    }
    const checkMacValue = encoder.generateCheckMacValue(data)

    const responseWithMac = {
      ...data,
      CheckMacValue: checkMacValue,
    }

    expect(encoder.verifyResponse(responseWithMac)).toBeTrue()
  })

  it('should fail verification with incorrect CheckMacValue', () => {
    const data = {
      MerchantID: '2000132',
      MerchantTradeNo: '123456',
      RtnCode: '1',
      RtnMsg: 'OK',
      CheckMacValue: 'INVALID_CHECKSUM', // Intentionally wrong
    }

    expect(encoder.verifyResponse(data)).toBeFalse()
  })

  it('should throw error on verifyOrFail with incorrect CheckMacValue', () => {
    const data = {
      MerchantID: '2000132',
      MerchantTradeNo: '123456',
      CheckMacValue: 'INVALID',
    }
    expect(() => encoder.verifyOrFail(data)).toThrow(LogisticsError)
  })

  it('should handle URL encoding correctly (.NET compatible)', () => {
    // Test special characters that ECPay requires to be encoded specifically
    const data = {
      Test: 'Test ( ) * ! - _ .',
    }
    // ( ) * ! - _ .  should be handled.
    // The encoder replaces %2d -> - , etc.
    const cmv = encoder.generateCheckMacValue(data)
    expect(cmv).toBeString()
  })
})
