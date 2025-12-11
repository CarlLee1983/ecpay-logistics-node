/**
 * ScheduledDeliveryTime - 預定送達時段
 *
 * 用於宅配物流，指定希望的送達時段。
 */
export enum ScheduledDeliveryTime {
  /** 不限時 */
  UNLIMITED = '4',
  /** 13 點前 */
  BEFORE_13 = '1',
  /** 14-18 點 */
  BETWEEN_14_18 = '2',
}
