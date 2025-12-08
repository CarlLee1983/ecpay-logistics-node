import { describe, expect, it } from 'bun:test'
import { ReturnHomeOrder } from '../src/operations/home/ReturnHomeOrder.js'
import { LogisticsError } from '../src/errors/LogisticsError.js'

describe('ReturnHomeOrder', () => {
  const merchantID = '2000132'
  const hashKey = '5294y06JbISpM5x9'
  const hashIV = 'v77hoKGq4kWxNNIS'

  it('should create valid return home order payload', () => {
    const returnOrder = new ReturnHomeOrder(merchantID, hashKey, hashIV)
    returnOrder.setAllPayLogisticsID('11223344')
    returnOrder.setServerReplyURL('https://example.com/return')
    returnOrder.setGoodsName('Returned Item')
    returnOrder.setGoodsAmount(100)
    returnOrder.setSenderName('Sender')
    returnOrder.setSenderPhone('0912123123')
    returnOrder.setSenderZipCode('100')
    returnOrder.setSenderAddress('Taipei')

    // Optional setters
    returnOrder.setRemark('Remark')
    returnOrder.setQuantity('1')
    returnOrder.setCost('100')

    const payload = returnOrder.getContent()
    expect(payload.AllPayLogisticsID).toBe('11223344')
    expect(payload.GoodsName).toBe('Returned Item')
    expect(payload.Remark).toBe('Remark')
    expect(payload.Quantity).toBe('1')
    expect(payload.Cost).toBe('100')
    expect(payload.CheckMacValue).toBeDefined()
  })

  it('should validate required fields', () => {
    const ret = new ReturnHomeOrder(merchantID, hashKey, hashIV)
    expect(() => ret.getContent()).toThrow(LogisticsError)
  })
})
