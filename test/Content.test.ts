import { describe, expect, it } from 'bun:test'
import { Content } from '../src/base/Content.js'
import { LogisticsError } from '../src/errors/LogisticsError.js'
import { CheckMacEncoder } from '../src/security/CheckMacEncoder.js'

// Create a concrete implementation of the abstract Content class for testing
class TestContent extends Content {
  protected requestPath = '/test/path'

  validate(): void {
    this.validateBaseParam()
    // No extra validation for this test class
  }
}

describe('Content (Abstract Base Class)', () => {
  const merchantID = '2000132'
  const hashKey = '5294y06JbISpM5x9'
  const hashIV = 'v77hoKGq4kWxNNIS'

  it('should initialize with correct default values', () => {
    const content = new TestContent(merchantID, hashKey, hashIV)
    expect(content.getMerchantID()).toBe(merchantID)
  })

  it('should set and get base properties correctly', () => {
    const content = new TestContent(merchantID, hashKey, hashIV)

    // Test Setters & Getters
    content.setMerchantID('NewID')
    expect(content.getMerchantID()).toBe('NewID')

    content.setHashKey('NewKey')
    content.setHashIV('NewIV')
    // We can verify these via getEncoder or internal state if exposed,
    // but primarily we check if they don't throw.
    // Or check indirectly by generating checkmacvalue.

    content.setPlatformID('PID')
    const payload = content.getContent()
    expect(payload.PlatformID).toBe('PID')

    content.setRemark('MyRemark')
    const payload2 = content.getContent()
    expect(payload2.Remark).toBe('MyRemark')

    content.setServerUrl('http://test.com')
    // No direct getter for ServerUrl usually, but used in execution.
    // We can check if it sets property if public or protected.
    // For now, just ensuring it's callable.
  })

  it('should set and get request path', () => {
    const content = new TestContent(merchantID, hashKey, hashIV)
    // TestContent defines '/test/path'
    expect(content.getRequestPath()).toBe('/test/path')
  })

  it('should allow setting client and server reply URLs', () => {
    const content = new TestContent(merchantID, hashKey, hashIV)
    content.setClientReplyURL('http://client')
    content.setServerReplyURL('http://server')

    const payload = content.getContent()
    expect(payload.ClientReplyURL).toBe('http://client')
    expect(payload.ServerReplyURL).toBe('http://server')
  })

  it('should validate base parameters', () => {
    const content = new TestContent('', hashKey, hashIV) // Missing MerchantID
    expect(() => content.getPayload()).toThrow(LogisticsError)

    const content2 = new TestContent(merchantID, '', hashIV) // Missing HashKey
    expect(() => content2.getPayload()).toThrow(LogisticsError)

    const content3 = new TestContent(merchantID, hashKey, '') // Missing HashIV
    expect(() => content3.getPayload()).toThrow(LogisticsError)
  })

  it('should set MerchantTradeNo correctly', () => {
    const content = new TestContent(merchantID, hashKey, hashIV)
    content.setMerchantTradeNo('Order123')
    const payload = content.getPayload()
    expect(payload.MerchantTradeNo).toBe('Order123')
  })

  it('should throw error if MerchantTradeNo is too long', () => {
    const content = new TestContent(merchantID, hashKey, hashIV)
    const longId = 'A'.repeat(21)
    expect(() => content.setMerchantTradeNo(longId)).toThrow(LogisticsError)
  })

  it('should format MerchantTradeDate correctly from Date object', () => {
    const content = new TestContent(merchantID, hashKey, hashIV)
    const date = new Date('2024-01-01T12:30:45')
    content.setMerchantTradeDate(date)
    const payload = content.getPayload()
    // Local time implementation might vary, but let's check format 'YYYY/MM/DD HH:mm:ss'
    expect(payload.MerchantTradeDate).toMatch(/^\d{4}\/\d{2}\/\d{2} \d{2}:\d{2}:\d{2}$/)
  })

  it('should set MerchantTradeDate from string directly', () => {
    const content = new TestContent(merchantID, hashKey, hashIV)
    const dateStr = '2024/01/01 12:30:45'
    content.setMerchantTradeDate(dateStr)
    const payload = content.getPayload()
    expect(payload.MerchantTradeDate).toBe(dateStr)
  })

  it('should generate CheckMacValue in getContent', () => {
    const content = new TestContent(merchantID, hashKey, hashIV)
    content.setMerchantTradeNo('Test1234')
    const payload = content.getContent()

    expect(payload.CheckMacValue).toBeDefined()
    expect(payload.MerchantID).toBe(merchantID)
  })

  it('should allow setting encoder manually', () => {
    const content = new TestContent(merchantID, hashKey, hashIV)
    const encoder = new CheckMacEncoder(hashKey, hashIV)
    content.setEncoder(encoder)
    const payload = content.getContent()
    expect(payload.CheckMacValue).toBeDefined()
  })
})

describe('Concrete Implementations', () => {})
