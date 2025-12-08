import { describe, expect, it } from 'bun:test'
import { UpdateCvsOrder } from '../src/operations/cvs/UpdateCvsOrder.js'
import { CancelCvsOrder } from '../src/operations/cvs/CancelCvsOrder.js'
import { ReturnCvsOrder } from '../src/operations/cvs/ReturnCvsOrder.js'
import { LogisticsError } from '../src/errors/LogisticsError.js'

const merchantID = '2000132'
const hashKey = '5294y06JbISpM5x9'
const hashIV = 'v77hoKGq4kWxNNIS'

describe('CVS Order Operations', () => {
  describe('UpdateCvsOrder', () => {
    it('should create valid update payload', () => {
      const update = new UpdateCvsOrder(merchantID, hashKey, hashIV)
      update
        .setAllPayLogisticsID('12345678')
        .setShipmentDate(new Date('2024-01-01'))
        .setReceiverStoreID('ST123')

      const payload = update.getContent()
      expect(payload.AllPayLogisticsID).toBe('12345678')
      expect(payload.ReceiverStoreID).toBe('ST123')
      expect(payload.CheckMacValue).toBeDefined()
    })

    it('should validate required fields', () => {
      const update = new UpdateCvsOrder(merchantID, hashKey, hashIV)
      expect(() => update.getContent()).toThrow(LogisticsError) // Missing AllPayLogisticsID
    })
  })

  describe('CancelCvsOrder', () => {
    it('should create valid cancel payload', () => {
      const cancel = new CancelCvsOrder(merchantID, hashKey, hashIV)
      cancel.setAllPayLogisticsID('87654321').setCVSPaymentNo('CVS123').setCVSValidationNo('VAL456')

      const payload = cancel.getContent()
      expect(payload.AllPayLogisticsID).toBe('87654321')
      expect(payload.CVSPaymentNo).toBe('CVS123')
    })

    it('should validate required fields', () => {
      const cancel = new CancelCvsOrder(merchantID, hashKey, hashIV)
      expect(() => cancel.getContent()).toThrow(LogisticsError)
    })
  })

  describe('ReturnCvsOrder', () => {
    it('should create valid return payload', () => {
      const returnOrder = new ReturnCvsOrder(merchantID, hashKey, hashIV)
      returnOrder.setAllPayLogisticsID('LOG123')
      returnOrder.setServerReplyURL('http://url')
      returnOrder.setGoodsName('Goods')
      returnOrder.setGoodsAmount(100)
      returnOrder.setSenderName('Sender')
      returnOrder.setSenderPhone('0912123123')

      // Additional setters
      returnOrder.setRemark('Remark')
      returnOrder.setQuantity('1')
      returnOrder.setCost('100')

      const payload = returnOrder.getContent()
      expect(payload.AllPayLogisticsID).toBe('LOG123')
      expect(payload.Remark).toBe('Remark')
      expect(payload.Quantity).toBe('1')
      expect(payload.Cost).toBe('100')
      expect(payload.GoodsName).toBe('Goods') // Added this line to ensure GoodsName is still tested and to fix syntax
    })

    it('should validate required fields', () => {
      const ret = new ReturnCvsOrder(merchantID, hashKey, hashIV)
      expect(() => ret.getContent()).toThrow(LogisticsError)
    })
  })
})
