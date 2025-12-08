import { CheckMacEncoder } from '../security/CheckMacEncoder.js'

export interface ILogisticsCommand {
  /**
   * Get the payload for the API request.
   */
  getPayload(): Record<string, any>

  /**
   * Get the payload signed with CheckMacValue.
   */
  getContent(): Record<string, any>

  /**
   * Get the API endpoint path.
   */
  getRequestPath(): string

  /**
   * Get the configured encoder.
   */
  getEncoder(): CheckMacEncoder
}
