/**
 * Temperature - 溫層
 *
 * 用於宅配物流，指定配送的溫層條件。
 */
export enum Temperature {
  /** 常溫 */
  ROOM = '0001',
  /** 冷藏 */
  REFRIGERATION = '0002',
  /** 冷凍 */
  FREEZE = '0003',
}
