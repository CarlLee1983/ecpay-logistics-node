export class LogisticsError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'LogisticsError'
  }

  static required(field: string): LogisticsError {
    return new LogisticsError(`Missing required field: ${field}`)
  }

  static invalid(field: string, reason: string): LogisticsError {
    return new LogisticsError(`Invalid field ${field}: ${reason}`)
  }

  static tooLong(field: string, max: number): LogisticsError {
    return new LogisticsError(`Field ${field} exceeds max length of ${max}`)
  }

  static checkMacValueFailed(): LogisticsError {
    return new LogisticsError('CheckMacValue verification failed')
  }

  static httpError(message: string): LogisticsError {
    return new LogisticsError(`HTTP Request Error: ${message}`)
  }
}
