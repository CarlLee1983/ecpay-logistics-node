export enum LogisticsSubType {
  // C2C Utils (Store to Store)
  UNIMART_C2C = 'UNIMARTC2C', // 7-Eleven
  FAMI_C2C = 'FAMIC2C', // FamilyMart
  HILIFE_C2C = 'HILIFEC2C', // Hi-Life
  OKMART_C2C = 'OKMARTC2C', // OK Mart

  // B2C Utils (Business to Store)
  UNIMART = 'UNIMART', // 7-Eleven
  FAMI = 'FAMI', // FamilyMart
  HILIFE = 'HILIFE', // Hi-Life

  // Home Delivery
  TCAT = 'TCAT', // Black Cat (Takkyubin)
  POST = 'POST', // Chunghwa Post
}

export const LogisticsSubTypeHelpers = {
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

  isHome(subType: string): boolean {
    return [LogisticsSubType.TCAT, LogisticsSubType.POST].includes(subType as LogisticsSubType)
  },

  isC2C(subType: string): boolean {
    return [
      LogisticsSubType.UNIMART_C2C,
      LogisticsSubType.FAMI_C2C,
      LogisticsSubType.HILIFE_C2C,
      LogisticsSubType.OKMART_C2C,
    ].includes(subType as LogisticsSubType)
  },

  isB2C(subType: string): boolean {
    return [LogisticsSubType.UNIMART, LogisticsSubType.FAMI, LogisticsSubType.HILIFE].includes(
      subType as LogisticsSubType
    )
  },
}
