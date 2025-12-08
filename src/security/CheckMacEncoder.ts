import { createHash } from 'node:crypto'
import { LogisticsError } from '../errors/LogisticsError.js'

/**
 * CheckMacEncoder
 *
 * Responsible for generating and verifying the CheckMacValue (checksum)
 * for ECPay Logistics API.
 *
 * Note: ECPay Logistics uses MD5.
 */
export class CheckMacEncoder {
  private readonly hashKey: string
  private readonly hashIV: string

  constructor(hashKey: string, hashIV: string) {
    if (!hashKey) throw new Error('HashKey is required')
    if (!hashIV) throw new Error('HashIV is required')

    this.hashKey = hashKey
    this.hashIV = hashIV
  }

  /**
   * Encode the payload by adding CheckMacValue.
   */
  encodePayload(payload: Record<string, any>): Record<string, any> {
    const data = { ...payload }
    delete data.CheckMacValue

    data.CheckMacValue = this.generateCheckMacValue(data)
    return data
  }

  /**
   * Verify the response data's CheckMacValue.
   */
  verifyResponse(responseData: Record<string, any>): boolean {
    if (!responseData.CheckMacValue) {
      return false
    }

    const receivedCheckMac = responseData.CheckMacValue as string
    const data = { ...responseData }
    delete data.CheckMacValue

    const calculatedCheckMac = this.generateCheckMacValue(data)

    return receivedCheckMac.toUpperCase() === calculatedCheckMac.toUpperCase()
  }

  /**
   * Verify and throw error if invalid.
   */
  verifyOrFail(responseData: Record<string, any>): Record<string, any> {
    if (!this.verifyResponse(responseData)) {
      throw LogisticsError.checkMacValueFailed()
    }
    return responseData
  }

  /**
   * Generate CheckMacValue from data using MD5.
   */
  generateCheckMacValue(data: Record<string, any>): string {
    // 1. Sort keys alphabetically (A-Z)
    const sortedKeys = Object.keys(data).sort((a, b) =>
      a.toLowerCase().localeCompare(b.toLowerCase())
    )

    // 2. Build query string
    const pairs = sortedKeys.map((key) => `${key}=${data[key]}`)
    const queryString = pairs.join('&')

    // 3. Prepend HashKey, Append HashIV
    const raw = `HashKey=${this.hashKey}&${queryString}&HashIV=${this.hashIV}`

    // 4. URL Encode and Lowercase
    let encoded = encodeURIComponent(raw).toLowerCase()

    // 5. Replace specific characters to match .NET encoding
    encoded = this.dotNetUrlEncode(encoded)

    // 6. MD5 Hash -> Upper case
    return createHash('md5').update(encoded).digest('hex').toUpperCase()
  }

  private dotNetUrlEncode(str: string): string {
    return str
      .replace(/%2d/g, '-')
      .replace(/%5f/g, '_')
      .replace(/%2e/g, '.')
      .replace(/%21/g, '!')
      .replace(/%2a/g, '*')
      .replace(/%28/g, '(')
      .replace(/%29/g, ')')
      .replace(/%20/g, '+')
  }
}
