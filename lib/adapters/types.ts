export type PlatformId = 'x' | 'youtube' | 'linkedin' | 'instagram' | 'tiktok' | 'threads'

export interface PlatformMeta {
  id: PlatformId
  name: string
  metricLabel: { primary: string; secondary: string }
}

export interface DateRange {
  start: Date
  end: Date
}

export interface OverviewMetrics {
  followers: number
  followersDelta: number
  impressions: number
  engagement: number
  posts: number
  replies?: number
  shares?: number
  reposts?: number
}

export interface TimeSeriesPoint {
  date: string
  followers: number
  impressions: number
  engagement: number
  replies?: number
  shares?: number
  reposts?: number
  searchInterest?: number
}

export interface ContentItem {
  id: string
  title: string
  url: string
  publishedAt: string
  impressions: number
  engagement: number
  engagementRate: number
  obraIds?: string[]
  themeIds?: string[]
  responseCount?: number
  meanResponseLength?: number
  growthVelocity?: number
  shares?: number
  reposts?: number
  quotes?: number
  views?: number
  platformPostId?: string
  captureMethod?: 'official_api' | 'playwright' | 'import' | 'mock'
}

export interface PlatformAdapter {
  meta: PlatformMeta
  source: 'mock' | 'live'
  getOverview(range: DateRange): Promise<OverviewMetrics>
  getTimeSeries(range: DateRange): Promise<TimeSeriesPoint[]>
  getTopContent(range: DateRange, n: number): Promise<ContentItem[]>
}

export const PLATFORM_META: Record<PlatformId, PlatformMeta> = {
  x: {
    id: 'x',
    name: 'X (Twitter)',
    metricLabel: { primary: 'Impressions', secondary: 'Engagements' },
  },
  youtube: {
    id: 'youtube',
    name: 'YouTube',
    metricLabel: { primary: 'Views', secondary: 'Watch time' },
  },
  linkedin: {
    id: 'linkedin',
    name: 'LinkedIn',
    metricLabel: { primary: 'Impressions', secondary: 'Reactions' },
  },
  instagram: {
    id: 'instagram',
    name: 'Instagram',
    metricLabel: { primary: 'Reach', secondary: 'Likes' },
  },
  tiktok: {
    id: 'tiktok',
    name: 'TikTok',
    metricLabel: { primary: 'Views', secondary: 'Shares' },
  },
  threads: {
    id: 'threads',
    name: 'Threads',
    metricLabel: { primary: 'Views', secondary: 'Replies' },
  },
}

export const PLATFORM_IDS: PlatformId[] = ['threads', 'x', 'youtube', 'linkedin', 'instagram', 'tiktok']
