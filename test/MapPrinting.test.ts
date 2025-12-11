import { describe, expect, it } from 'bun:test'
import { Device } from '../src/enums/Device.js'
import { IsCollection } from '../src/enums/IsCollection.js'
import { LogisticsSubType } from '../src/enums/LogisticsSubType.js'
import { LogisticsError } from '../src/errors/LogisticsError.js'
import { OpenStoreMap } from '../src/operations/map/OpenStoreMap.js'
import { PrintCvsDocument } from '../src/printing/PrintCvsDocument.js'
import { PrintTradeDocument } from '../src/printing/PrintTradeDocument.js'

const merchantID = '2000132'
const hashKey = '5294y06JbISpM5x9'
const hashIV = 'v77hoKGq4kWxNNIS'

describe('Map & Printing', () => {
  describe('OpenStoreMap', () => {
    it('should create valid map payload', () => {
      const map = new OpenStoreMap(merchantID, hashKey, hashIV)
      map.setMerchantTradeNo('MapTest123')
      map.setMerchantTradeDate(new Date())
      map.setServerReplyURL('http://server')

      // Test convenience methods
      map.useUnimartC2C().usePCDevice()
      expect(map.getContent().LogisticsSubType).toBe(LogisticsSubType.UNIMART_C2C)
      expect(map.getContent().Device).toBe(Device.PC)

      map.useFamiC2C().useMobileDevice()
      expect(map.getContent().LogisticsSubType).toBe(LogisticsSubType.FAMI_C2C)
      expect(map.getContent().Device).toBe(Device.MOBILE)

      map.useHilifeC2C()
      expect(map.getContent().LogisticsSubType).toBe(LogisticsSubType.HILIFE_C2C)

      map.useOkmartC2C()
      expect(map.getContent().LogisticsSubType).toBe(LogisticsSubType.OKMART_C2C)

      map.useUnimartB2C()
      expect(map.getContent().LogisticsSubType).toBe(LogisticsSubType.UNIMART)

      map.useFamiB2C()
      expect(map.getContent().LogisticsSubType).toBe(LogisticsSubType.FAMI)

      map.useHilifeB2C()
      expect(map.getContent().LogisticsSubType).toBe(LogisticsSubType.HILIFE)

      map.setExtraData('Extra')
      expect(map.getContent().ExtraData).toBe('Extra')

      map.setIsCollection(IsCollection.YES)
      expect(map.getContent().IsCollection).toBe(IsCollection.YES)
    })

    it('should validate required fields', () => {
      const map = new OpenStoreMap(merchantID, hashKey, hashIV)
      // Default init has some fields, but MerchantTradeNo, Date, ServerReplyURL are needed
      expect(() => map.getPayload()).toThrow(LogisticsError)
    })
  }) // End OpenStoreMap

  describe('PrintTradeDocument', () => {
    it('should create valid print trade doc payload', () => {
      const print = new PrintTradeDocument(merchantID, hashKey, hashIV)
      print.setAllPayLogisticsID('12345')
      expect(print.getContent().AllPayLogisticsID).toBe('12345')
    })

    it('should allow setting validation status', () => {
      const print = new PrintTradeDocument(merchantID, hashKey, hashIV)
      expect(print).toBeDefined()
    })

    it('should support additional setters', () => {
      const print = new PrintTradeDocument(merchantID, hashKey, hashIV)
      print.setAllPayLogisticsID('12345')
      print.addLogisticsID('67890')
      expect(print.getContent().AllPayLogisticsID).toBe('12345,67890')

      print.setAllPayLogisticsIDs(['A1', 'A2'])
      expect(print.getContent().AllPayLogisticsID).toBe('A1,A2')

      print.setPlatformID('PID')
      expect(print.getContent().PlatformID).toBe('PID')
    })

    it('should support all convenience methods for B2C/Home', () => {
      const print = new PrintTradeDocument(merchantID, hashKey, hashIV)
      print.setAllPayLogisticsID('12345') // Required for validation

      print.useUnimartB2C()
      expect(print.getContent().LogisticsSubType).toBe(LogisticsSubType.UNIMART)

      print.useFamiB2C()
      expect(print.getContent().LogisticsSubType).toBe(LogisticsSubType.FAMI)

      print.useHilifeB2C()
      expect(print.getContent().LogisticsSubType).toBe(LogisticsSubType.HILIFE)

      print.useTcat()
      expect(print.getContent().LogisticsSubType).toBe(LogisticsSubType.TCAT)

      print.usePost()
      expect(print.getContent().LogisticsSubType).toBe(LogisticsSubType.POST)
    })

    it('should throw error for C2C subtype', () => {
      const print = new PrintTradeDocument(merchantID, hashKey, hashIV)
      expect(() => print.setLogisticsSubType(LogisticsSubType.UNIMART_C2C)).toThrow(LogisticsError)
      expect(() => print.setLogisticsSubType(LogisticsSubType.FAMI_C2C)).toThrow(LogisticsError)
      expect(() => print.setLogisticsSubType(LogisticsSubType.HILIFE_C2C)).toThrow(LogisticsError)
      expect(() => print.setLogisticsSubType(LogisticsSubType.OKMART_C2C)).toThrow(LogisticsError)
    })

    it('should validate required fields', () => {
      const print = new PrintTradeDocument(merchantID, hashKey, hashIV)
      expect(() => print.getPayload()).toThrow(LogisticsError)
    })
  })

  describe('PrintCvsDocument', () => {
    it('should create valid print cvs doc payload', () => {
      const print = new PrintCvsDocument(merchantID, hashKey, hashIV)
      print.useUnimartC2C()
      print.setCVSPaymentNo('123')
      print.setCVSValidationNo('456')
      expect(print.getContent().LogisticsSubType).toBe(LogisticsSubType.UNIMART_C2C)
    })

    it('should allow setting platform ID', () => {
      const print = new PrintCvsDocument(merchantID, hashKey, hashIV)
      print.useUnimartC2C() // Set required subtype
      print.setCVSPaymentNo('123')
      print.setCVSValidationNo('456')
      print.setPlatformID('PID')
      expect(print.getContent().PlatformID).toBe('PID')
    })

    it('should support additional fields', () => {
      const print = new PrintCvsDocument(merchantID, hashKey, hashIV)
      print.useUnimartC2C()
      print.setCVSPaymentNo('123')
      print.setCVSValidationNo('456')

      expect(print.getContent().CVSPaymentNo).toBe('123')
      expect(print.getContent().CVSValidationNo).toBe('456')
    })

    it('should support array setters', () => {
      const print = new PrintCvsDocument(merchantID, hashKey, hashIV)
      print.useUnimartC2C()

      print.setCVSPaymentNos(['123', '456'])
      print.setCVSValidationNos(['789', '012'])

      const content = print.getContent()
      expect(content.CVSPaymentNo).toBe('123,456')
      expect(content.CVSValidationNo).toBe('789,012')

      const printOther = new PrintCvsDocument(merchantID, hashKey, hashIV)
      printOther.useFamiC2C() // Fami C2C uses AllPayLogisticsID
      printOther.setAllPayLogisticsIDs(['A1', 'A2'])
      expect(printOther.getContent().AllPayLogisticsID).toBe('A1,A2')

      printOther.setAllPayLogisticsID('B1')
      expect(printOther.getContent().AllPayLogisticsID).toBe('B1')
    })

    it('should support other C2C types', () => {
      const print = new PrintCvsDocument(merchantID, hashKey, hashIV)
      print.useHilifeC2C()
      print.setAllPayLogisticsID('H123')
      expect(print.getContent().LogisticsSubType).toBe(LogisticsSubType.HILIFE_C2C)

      print.useOkmartC2C()
      // AllPayLogisticsID is already set to H123, so validation passes
      expect(print.getContent().LogisticsSubType).toBe(LogisticsSubType.OKMART_C2C)
    })

    it('should support forUnimart helper', () => {
      const print = new PrintCvsDocument(merchantID, hashKey, hashIV)
      print.forUnimart('PAY123', 'VAL456')

      const content = print.getContent()
      expect(content.LogisticsSubType).toBe(LogisticsSubType.UNIMART_C2C)
      expect(content.CVSPaymentNo).toBe('PAY123')
      expect(content.CVSValidationNo).toBe('VAL456')
    })

    it('should throw error for non-C2C subtype in PrintCvsDocument', () => {
      const print = new PrintCvsDocument(merchantID, hashKey, hashIV)
      expect(() => print.setLogisticsSubType(LogisticsSubType.UNIMART)).toThrow(LogisticsError)
    })

    it('should validate required fields', () => {
      const print = new PrintCvsDocument(merchantID, hashKey, hashIV)
      expect(() => print.getPayload()).toThrow(LogisticsError)
    })
  })
})
