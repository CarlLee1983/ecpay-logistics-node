import { describe, expect, it } from 'bun:test'
import { CreateHomeOrder } from '../src/operations/home/CreateHomeOrder.js'
import { LogisticsSubType } from '../src/enums/LogisticsSubType.js'
import { Temperature } from '../src/enums/Temperature.js'
import { Distance } from '../src/enums/Distance.js'
import { Specification } from '../src/enums/Specification.js'
import { ScheduledPickupTime } from '../src/enums/ScheduledPickupTime.js'
import { ScheduledDeliveryTime } from '../src/enums/ScheduledDeliveryTime.js'
import { LogisticsError } from '../src/errors/LogisticsError.js'

describe('CreateHomeOrder', () => {
  const merchantID = '2000132'
  const hashKey = '5294y06JbISpM5x9'
  const hashIV = 'v77hoKGq4kWxNNIS'

  it('should create valid TCAT order payload', () => {
    const create = new CreateHomeOrder(merchantID, hashKey, hashIV)
    create
      .useTcat()
      .setMerchantTradeNo('Home' + Date.now().toString().slice(-8))
      .setMerchantTradeDate(new Date())
      .setServerReplyURL('http://url')
      .setSenderName('Sender')
      .setSenderCellPhone('0912345678')
      .setSenderPhone('0212345678')
      .setSenderZipCode('100')
      .setSenderAddress('Sender Address')
      .setReceiverName('Receiver')
      .setReceiverCellPhone('0987654321')
      .setReceiverPhone('0287654321')
      .setReceiverZipCode('200')
      .setReceiverAddress('Receiver Address')
      .setReceiverEmail('test@example.com')
      .setGoodsAmount(1000)
      .setGoodsName('Home Goods')
    create.setTemperature(Temperature.ROOM)
    create.setDistance(Distance.SAME)
    create.setSpecification(Specification.SIZE_60)
    create.setScheduledPickupTime(ScheduledPickupTime.BEFORE_13)
    create.setScheduledDeliveryTime(ScheduledDeliveryTime.BEFORE_13)

    const payload = create.getContent()
    expect(payload.LogisticsSubType).toBe(LogisticsSubType.TCAT)
    expect(payload.GoodsAmount).toBe(1000)
    expect(payload.SenderPhone).toBe('0212345678')
    expect(payload.ReceiverPhone).toBe('0287654321')
    expect(payload.ReceiverEmail).toBe('test@example.com')
    expect(payload.Temperature).toBe(Temperature.ROOM)
    expect(payload.CheckMacValue).toBeDefined()
  })

  it('should create valid POST order payload', () => {
    const create = new CreateHomeOrder(merchantID, hashKey, hashIV)
    create
      .usePostNormal()
      .setMerchantTradeNo('Post' + Date.now().toString().slice(-8))
      .setMerchantTradeDate(new Date())
      .setServerReplyURL('http://url')
      .setSenderName('Sender')
      .setSenderCellPhone('0912123123')
      .setSenderZipCode('100')
      .setSenderAddress('Taipei City')
      .setReceiverName('Receiver')
      .setReceiverCellPhone('0987987987')
      .setReceiverZipCode('200')
      .setReceiverAddress('Keelung City')
      .setGoodsAmount(500)
      .setGoodsName('Post Goods')

    const payload = create.getContent()
    expect(payload.LogisticsSubType).toBe(LogisticsSubType.POST)
  })

  it('should throw error for missing home delivery specific fields', () => {
    const create = new CreateHomeOrder(merchantID, hashKey, hashIV)
    create.useTcat()
    // Missing SenderZipCode
    create
      .setMerchantTradeNo('Test')
      .setMerchantTradeDate(new Date())
      .setServerReplyURL('http://url')
      .setSenderName('S')
      .setSenderCellPhone('0912')
      .setSenderAddress('Addr') // Missing Zip

    expect(() => create.getContent()).toThrow(LogisticsError)
  })
})
