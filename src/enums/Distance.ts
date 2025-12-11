/**
 * Distance - 配送距離
 *
 * 用於宅配物流，指定配送距離類型以計算運費。
 */
export enum Distance {
  /** 同縣市 */
  SAME = '00',
  /** 外縣市 */
  OTHER = '01',
  /** 離島 */
  ISLAND = '02',
}
