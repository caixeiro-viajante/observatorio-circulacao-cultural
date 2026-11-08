export interface TrendQuery {
  queryId: string
  terms: string[]
  geo?: string
  property?: 'web' | 'youtube' | 'news' | 'images' | 'shopping'
  start: string
  end: string
  category?: string
}

export interface TrendPoint {
  date: string
  value: number
  term: string
  geo?: string
  source: 'google-trends-api-alpha' | 'google-trends-ui-export' | 'mock'
}

export interface TrendResult {
  query: TrendQuery
  points: TrendPoint[]
  relatedTop?: string[]
  relatedRising?: string[]
  capturedAt: string
}

/**
 * Google Trends is contextual evidence, not a social-engagement metric.
 * Prefer the official Trends API when access is granted. Until then, this
 * boundary accepts an exported/approved provider without coupling the
 * observatory to an unofficial scraper.
 */
export interface TrendsProvider {
  source: TrendPoint['source']
  compare(query: TrendQuery): Promise<TrendResult>
}
