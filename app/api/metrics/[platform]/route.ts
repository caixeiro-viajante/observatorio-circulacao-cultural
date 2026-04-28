import { NextResponse } from 'next/server'
import { getAdapter } from '@/lib/adapters'
import { PLATFORM_IDS, type PlatformId } from '@/lib/adapters/types'
import { lastNDays } from '@/lib/date'

export const dynamic = 'force-dynamic'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ platform: string }> },
) {
  const { platform } = await params
  if (!PLATFORM_IDS.includes(platform as PlatformId)) {
    return NextResponse.json({ error: 'unknown platform' }, { status: 404 })
  }
  const url = new URL(request.url)
  const days = Math.max(1, Math.min(365, Number(url.searchParams.get('days') ?? 30)))

  const adapter = getAdapter(platform as PlatformId)
  const range = lastNDays(days)
  const [overview, series, top] = await Promise.all([
    adapter.getOverview(range),
    adapter.getTimeSeries(range),
    adapter.getTopContent(range, 5),
  ])

  return NextResponse.json({
    platform: adapter.meta,
    source: adapter.source,
    range: { days, start: range.start.toISOString(), end: range.end.toISOString() },
    overview,
    series,
    top,
  })
}
