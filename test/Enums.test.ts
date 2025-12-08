import { describe, expect, it } from 'bun:test'
import { LogisticsSubType, LogisticsSubTypeHelpers } from '../src/enums/LogisticsSubType.js'

describe('Enums Helper Tests', () => {
  it('should identify C2C types correctly', () => {
    expect(LogisticsSubTypeHelpers.isC2C(LogisticsSubType.UNIMART_C2C)).toBe(true)
    expect(LogisticsSubTypeHelpers.isC2C(LogisticsSubType.FAMI_C2C)).toBe(true)
    expect(LogisticsSubTypeHelpers.isC2C(LogisticsSubType.HILIFE_C2C)).toBe(true)
    expect(LogisticsSubTypeHelpers.isC2C(LogisticsSubType.OKMART_C2C)).toBe(true)

    expect(LogisticsSubTypeHelpers.isC2C(LogisticsSubType.UNIMART)).toBe(false)
    expect(LogisticsSubTypeHelpers.isC2C(LogisticsSubType.TCAT)).toBe(false)
  })

  it('should identify B2C types correctly', () => {
    expect(LogisticsSubTypeHelpers.isB2C(LogisticsSubType.UNIMART)).toBe(true)
    expect(LogisticsSubTypeHelpers.isB2C(LogisticsSubType.FAMI)).toBe(true)
    expect(LogisticsSubTypeHelpers.isB2C(LogisticsSubType.HILIFE)).toBe(true)

    expect(LogisticsSubTypeHelpers.isB2C(LogisticsSubType.UNIMART_C2C)).toBe(false)
    expect(LogisticsSubTypeHelpers.isB2C(LogisticsSubType.TCAT)).toBe(false)
  })

  it('should identify Home types correctly', () => {
    expect(LogisticsSubTypeHelpers.isHome(LogisticsSubType.TCAT)).toBe(true)
    expect(LogisticsSubTypeHelpers.isHome(LogisticsSubType.POST)).toBe(true)

    expect(LogisticsSubTypeHelpers.isHome(LogisticsSubType.UNIMART)).toBe(false)
  })

  it('should identify CVS types correctly (C2C + B2C)', () => {
    // C2C
    expect(LogisticsSubTypeHelpers.isCvs(LogisticsSubType.UNIMART_C2C)).toBe(true)
    expect(LogisticsSubTypeHelpers.isCvs(LogisticsSubType.FAMI_C2C)).toBe(true)
    // B2C
    expect(LogisticsSubTypeHelpers.isCvs(LogisticsSubType.UNIMART)).toBe(true)
    expect(LogisticsSubTypeHelpers.isCvs(LogisticsSubType.FAMI)).toBe(true)

    // Non-CVS
    expect(LogisticsSubTypeHelpers.isCvs(LogisticsSubType.TCAT)).toBe(false)
  })
})
