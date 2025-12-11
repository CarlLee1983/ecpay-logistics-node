/**
 * StoreType - 門市類型
 *
 * 用於查詢門市清單時，指定門市的服務類型。
 */
export enum StoreType {
  /** 純取貨門市 */
  PICKUP_ONLY = '01',
  /** 取貨付款門市 */
  PICKUP_AND_RETURN = '02',
  /** 純退貨門市 */
  RETURN_ONLY = '03',
}
