import { describe, expect, it } from 'bun:test'
import { IsCollection } from '../src/enums/IsCollection.js'
import { LogisticsSubType } from '../src/enums/LogisticsSubType.js'
import { LogisticsError } from '../src/errors/LogisticsError.js'
import { CreateCvsOrder } from '../src/operations/cvs/CreateCvsOrder.js'

describe('CreateCvsOrder', () => {
  const merchantID = '2000132'
  const hashKey = '5294y06JbISpM5x9'
  const hashIV = 'v77hoKGq4kWxNNIS'

  it('should create a valid UNIMART C2C order payload', () => {
    const create = new CreateCvsOrder(merchantID, hashKey, hashIV)
    create
      .useUnimartC2C()
      .setMerchantTradeNo(`OC2C${Date.now().toString().slice(-8)}`) // Ensure < 20
      .setMerchantTradeDate(new Date())
      .setServerReplyURL('https://example.com/callback')
      .setSenderName('Sender')
      .setSenderCellPhone('0912345678')
      .setReceiverName('Receiver')
      .setReceiverCellPhone('0987654321')
      .setReceiverStoreID('123456')
      .setGoodsAmount(100)
      .setGoodsName('Test Goods')
      .setIsCollection(IsCollection.NO)

    const payload = create.getContent()
    expect(payload.LogisticsSubType).toBe(LogisticsSubType.UNIMART_C2C)
    expect(payload.ReceiverStoreID).toBe('123456')
    expect(payload.CheckMacValue).toBeDefined()
  })

  it('should create a valid FAMI B2C order payload', () => {
    const create = new CreateCvsOrder(merchantID, hashKey, hashIV)
    create
      .useFamiB2C()
      .setMerchantTradeNo(`OB2C${Date.now().toString().slice(-8)}`)
      .setMerchantTradeDate(new Date())
      .setServerReplyURL('https://example.com/callback')
      .setSenderName('Sender') // Required field
      .setSenderCellPhone('0912123123') // Required field
      .setSenderZipCode('100')
      .setSenderAddress('Taipei City')
      .setServiceType('1') // ServiceType 1: Pickup 3: Delivery (just testing setter)
      .setReceiverName('Receiver')
      .setReceiverCellPhone('0987654321')
      .setReceiverStoreID('654321')
      .setGoodsAmount(200)
      .setGoodsName('B2C Goods')
      .setIsCollection(IsCollection.YES)
      .setCollectionAmount(200)

    const payload = create.getContent()
    expect(payload.LogisticsSubType).toBe(LogisticsSubType.FAMI)
    expect(payload.ReceiverStoreID).toBe('654321')
    expect(payload.IsCollection).toBe(IsCollection.YES)
  })

  it('should validate required fields for C2C', () => {
    const create = new CreateCvsOrder(merchantID, hashKey, hashIV)
    create.useUnimartC2C()
    // Missing SenderName
    expect(() => create.getContent()).toThrow(LogisticsError)
  })

  it('should validate GoodsAmount limits', () => {
    const create = new CreateCvsOrder(merchantID, hashKey, hashIV)
    expect(() => create.setGoodsAmount(-1)).toThrow(LogisticsError)
  })

  it('should correctly switch sub-types via helper methods', () => {
    const create = new CreateCvsOrder(merchantID, hashKey, hashIV)

    // Setup minimal valid state for getPayload check
    create
      .setMerchantTradeNo('TestSwitch')
      .setMerchantTradeDate(new Date())
      .setServerReplyURL('http://url')
      .setSenderName('S')
      .setSenderCellPhone('0912')
      .setReceiverName('R')
      .setReceiverCellPhone('0987')
      .setReceiverStoreID('123')
      .setGoodsAmount(100)
      .setGoodsName('N')

    create.useHilifeC2C()
    expect(create.getPayload().LogisticsSubType).toBe(LogisticsSubType.HILIFE_C2C)

    create.useOkmartC2C()
    expect(create.getPayload().LogisticsSubType).toBe(LogisticsSubType.OKMART_C2C)
  })

  it('should correctly update subtype when switching methods', () => {
    const create = new CreateCvsOrder(merchantID, hashKey, hashIV)
    create.setMerchantTradeNo(`T${Date.now().toString().slice(-10)}`)
    create.setMerchantTradeDate(new Date())
    create.setGoodsName('Test')
    create.setSenderName('Sender')
    create.setSenderCellPhone('0912345678')
    create.setReceiverName('Receiver')
    create.setReceiverCellPhone('0912345678')
    create.setReceiverStoreID('123')
    create.setServerReplyURL('http://url')

    create.useUnimartC2C()
    create.useUnimartB2C()
    const payload = create.getContent()
    expect(payload.LogisticsSubType).toBe(LogisticsSubType.UNIMART)
  })

  it('should allow setting optional fields and use C2C helpers', () => {
    const create = new CreateCvsOrder(merchantID, hashKey, hashIV)
    // Set required fields first
    create.useUnimartC2C()
    create.setMerchantTradeNo(`TestOpt${Date.now()}`)
    create.setMerchantTradeDate(new Date())
    create.setGoodsName('Test Goods')
    create.setSenderName('Sender')
    create.setSenderCellPhone('0912345678')
    create.setReceiverName('Receiver')
    create.setReceiverCellPhone('0912345678')
    create.setReceiverStoreID('123')
    create.setServerReplyURL('http://url')

    create.setReceiverEmail('test@example.com')
    create.setReceiverPhone('0212345678')
    create.setPlatformID('PID')

    // Missing coverage lines
    create.setSenderPhone('0287654321')
    create.setReturnStoreID('999')
    create.setAllPayLogisticsID('LOG123')

    // Also test useFamiC2C
    create.useFamiC2C()

    const payload = create.getContent()
    expect(payload.ReceiverEmail).toBe('test@example.com')
    expect(payload.SenderPhone).toBe('0287654321')
    expect(payload.ReturnStoreID).toBe('999')
    expect(payload.AllPayLogisticsID).toBe('LOG123')
    expect(payload.LogisticsSubType).toBe(LogisticsSubType.FAMI_C2C)
  })

  it('should throw error for negative goods amount', () => {
    const create = new CreateCvsOrder(merchantID, hashKey, hashIV)
    expect(() => create.setGoodsAmount(-100)).toThrow(LogisticsError)
  })

  it('should throw error for negative collection amount', () => {
    const create = new CreateCvsOrder(merchantID, hashKey, hashIV)
    expect(() => create.setCollectionAmount(-100)).toThrow(LogisticsError)
  })

  it('should handle collection amount logic', () => {
    const create = new CreateCvsOrder(merchantID, hashKey, hashIV)

    // Setup minimal valid state
    create
      .setMerchantTradeNo('TestColl')
      .setMerchantTradeDate(new Date())
      .setServerReplyURL('http://url')
      .setSenderName('S')
      .setSenderCellPhone('0912')
      .setReceiverName('R')
      .setReceiverCellPhone('0987')
      .setReceiverStoreID('123')
      .setGoodsAmount(100)
      .setGoodsName('N')

    create.withCollection(500)
    const payload = create.getPayload()
    expect(payload.IsCollection).toBe(IsCollection.YES)
    expect(payload.CollectionAmount).toBe(500)

    create.withoutCollection()
    const payload2 = create.getPayload()
    expect(payload2.IsCollection).toBe(IsCollection.NO)
    // CollectionAmount remains in state but logic often depends on IsCollection flag
    expect(payload2.CollectionAmount).toBe(500)
  })
})
