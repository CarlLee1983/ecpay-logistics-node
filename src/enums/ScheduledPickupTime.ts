/**
 * ScheduledPickupTime - 預定取貨時段
 *
 * 用於宅配物流，指定希望的取貨時段。
 */
export enum ScheduledPickupTime {
  /** 不限時 */
  UNLIMITED = '4',
  /** 13 點前 */
  BEFORE_13 = '1',
  /** 14-18 點 */
  BETWEEN_14_18 = '2',
}
