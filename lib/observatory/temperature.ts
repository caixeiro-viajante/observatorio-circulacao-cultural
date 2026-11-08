import type { ContentItem } from '@/lib/adapters/types'

export type TemperatureScope = 'broad' | 'focused'
export type TopWindow = 5 | 10 | 20

export interface TemperatureQuery {
  queryId: string
  label: string
  scope: TemperatureScope
  terms: string[]
  obraIds?: string[]
  themeIds?: string[]
  top?: TopWindow
  start: string
  end: string
}

export interface TemperatureRow {
  rank: number
  label: string
  obraIds: string[]
  themeIds: string[]
  posts: number
  exposure: number
  replication: number
  replies: number
  shares: number
  meanResponseLength: number
  growthVelocity: number
  crossPlatformSpread: number
  searchInterest?: number
  circulationScore: number
}

function safeRate(value: number, denominator: number): number {
  return denominator > 0 ? value / denominator : 0
}

function minMax(value: number, min: number, max: number): number {
  return max === min ? (value > 0 ? 1 : 0) : (value - min) / (max - min)
}

export function rankTemperature(items: ContentItem[], top: TopWindow = 10): TemperatureRow[] {
  const rows = items.map((item) => {
    const exposure = Math.max(0, item.impressions)
    const replication = item.engagement
    const replies = item.responseCount ?? 0
    const shares = item.shares ?? item.reposts ?? item.quotes ?? 0
    return {
      label: item.title,
      obraIds: item.obraIds ?? [],
      themeIds: item.themeIds ?? [],
      posts: 1,
      exposure,
      replication,
      replies,
      shares,
      meanResponseLength: item.meanResponseLength ?? 0,
      growthVelocity: item.growthVelocity ?? 0,
      crossPlatformSpread: 1,
      circulationScore: 0,
    }
  })

  const values = (key: keyof TemperatureRow) =>
    rows.map((row) => Number(row[key])).filter(Number.isFinite)
  const ranges = new Map<keyof TemperatureRow, [number, number]>()
  for (const key of ['replication', 'replies', 'shares', 'meanResponseLength', 'growthVelocity'] as const) {
    const v = values(key)
    ranges.set(key, [Math.min(...v, 0), Math.max(...v, 0)])
  }

  for (const row of rows) {
    const replicationRate = safeRate(row.replication, row.exposure)
    const replyRate = safeRate(row.replies, row.exposure)
    const shareRate = safeRate(row.shares, row.exposure)
    const score =
      0.25 * replicationRate +
      0.20 * replyRate +
      0.20 * shareRate +
      0.15 * minMax(row.meanResponseLength, ...ranges.get('meanResponseLength')!) +
      0.20 * minMax(row.growthVelocity, ...ranges.get('growthVelocity')!)
    row.circulationScore = score
  }

  return rows
    .sort((a, b) => b.circulationScore - a.circulationScore)
    .slice(0, top)
    .map((row, index) => ({ ...row, rank: index + 1 }))
}
