/**
 * LogisticsSubType - 物流子類型
 *
 * 定義各種超商取貨和宅配服務的子類型。
 */
export enum LogisticsSubType {
  // ========== C2C 超商（店到店）==========

  /** 7-ELEVEN C2C（店到店）*/
  UNIMART_C2C = 'UNIMARTC2C',
  /** 全家 C2C（店到店）*/
  FAMI_C2C = 'FAMIC2C',
  /** 萊爾富 C2C（店到店）*/
  HILIFE_C2C = 'HILIFEC2C',
  /** OK Mart C2C（店到店）*/
  OKMART_C2C = 'OKMARTC2C',

  // ========== B2C 超商（廠商到店）==========

  /** 7-ELEVEN B2C（廠商到店）*/
  UNIMART = 'UNIMART',
  /** 全家 B2C（廠商到店）*/
  FAMI = 'FAMI',
  /** 萊爾富 B2C（廠商到店）*/
  HILIFE = 'HILIFE',

  // ========== 宅配 ==========

  /** 黑貓宅急便 */
  TCAT = 'TCAT',
  /** 中華郵政 */
  POST = 'POST',
}

/**
 * LogisticsSubTypeHelpers - 物流子類型輔助函式
 *
 * 提供判斷物流子類型的便利方法。
 */
export const LogisticsSubTypeHelpers = {
  /**
   * 判斷是否為超商取貨類型
   *
   * @param subType - 物流子類型
   * @returns 是否為超商取貨
   */
  isCvs(subType: string): boolean {
    return [
      LogisticsSubType.UNIMART_C2C,
      LogisticsSubType.FAMI_C2C,
      LogisticsSubType.HILIFE_C2C,
      LogisticsSubType.OKMART_C2C,
      LogisticsSubType.UNIMART,
      LogisticsSubType.FAMI,
      LogisticsSubType.HILIFE,
    ].includes(subType as LogisticsSubType)
  },

  /**
   * 判斷是否為宅配類型
   *
   * @param subType - 物流子類型
   * @returns 是否為宅配
   */
  isHome(subType: string): boolean {
    return [LogisticsSubType.TCAT, LogisticsSubType.POST].includes(subType as LogisticsSubType)
  },

  /**
   * 判斷是否為 C2C（店到店）類型
   *
   * @param subType - 物流子類型
   * @returns 是否為 C2C
   */
  isC2C(subType: string): boolean {
    return [
      LogisticsSubType.UNIMART_C2C,
      LogisticsSubType.FAMI_C2C,
      LogisticsSubType.HILIFE_C2C,
      LogisticsSubType.OKMART_C2C,
    ].includes(subType as LogisticsSubType)
  },

  /**
   * 判斷是否為 B2C（廠商到店）類型
   *
   * @param subType - 物流子類型
   * @returns 是否為 B2C
   */
  isB2C(subType: string): boolean {
    return [LogisticsSubType.UNIMART, LogisticsSubType.FAMI, LogisticsSubType.HILIFE].includes(
      subType as LogisticsSubType
    )
  },
}
