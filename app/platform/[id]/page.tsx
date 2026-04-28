import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { getAdapter } from '@/lib/adapters'
import { PLATFORM_IDS, type PlatformId } from '@/lib/adapters/types'
import { lastNDays } from '@/lib/date'
import { KpiCard } from '@/components/kpi-card'
import { LineChart } from '@/components/charts/line-chart'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDelta, formatNumber, formatPercent } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export async function generateStaticParams() {
  return PLATFORM_IDS.map((id) => ({ id }))
}

export default async function PlatformPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!PLATFORM_IDS.includes(id as PlatformId)) notFound()

  const adapter = getAdapter(id as PlatformId)
  const range = lastNDays(30)
  const priorRange = lastNDays(30, new Date(range.start.getTime() - 1))

  const [overview, prior, series, top] = await Promise.all([
    adapter.getOverview(range),
    adapter.getOverview(priorRange),
    adapter.getTimeSeries(range),
    adapter.getTopContent(range, 5),
  ])

  return (
    <div className="space-y-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-brand-muted hover:text-brand-fg"
      >
        <ArrowLeft className="h-4 w-4" /> All platforms
      </Link>

      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">{adapter.meta.name}</h1>
          <p className="mt-1 text-brand-muted">Last 30 days</p>
        </div>
        <Badge tone={adapter.source === 'live' ? 'live' : 'demo'}>
          {adapter.source === 'live' ? 'LIVE' : 'DEMO'}
        </Badge>
      </header>

      <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <KpiCard
          label="Followers"
          value={overview.followers}
          delta={formatDelta(overview.followers, prior.followers)}
        />
        <KpiCard
          label={adapter.meta.metricLabel.primary}
          value={overview.impressions}
          delta={formatDelta(overview.impressions, prior.impressions)}
        />
        <KpiCard
          label={adapter.meta.metricLabel.secondary}
          value={overview.engagement}
          delta={formatDelta(overview.engagement, prior.engagement)}
        />
        <KpiCard
          label="Posts"
          value={overview.posts}
          delta={formatDelta(overview.posts, prior.posts)}
        />
      </section>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Performance over time</CardTitle>
            <CardDescription>Daily {adapter.meta.metricLabel.primary.toLowerCase()} and {adapter.meta.metricLabel.secondary.toLowerCase()}</CardDescription>
          </div>
        </CardHeader>
        <LineChart
          data={series}
          xKey="date"
          series={[
            { key: 'impressions', label: adapter.meta.metricLabel.primary, color: 'rgb(var(--brand-primary))' },
            { key: 'engagement', label: adapter.meta.metricLabel.secondary, color: 'rgb(var(--brand-accent))' },
          ]}
        />
      </Card>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Top content</CardTitle>
            <CardDescription>Sorted by {adapter.meta.metricLabel.primary.toLowerCase()}</CardDescription>
          </div>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-brand-border text-left text-xs uppercase tracking-wide text-brand-muted">
              <tr>
                <th className="py-2 pr-3 font-medium">Title</th>
                <th className="py-2 pr-3 font-medium">Date</th>
                <th className="py-2 pr-3 font-medium text-right">{adapter.meta.metricLabel.primary}</th>
                <th className="py-2 pr-3 font-medium text-right">{adapter.meta.metricLabel.secondary}</th>
                <th className="py-2 font-medium text-right">Eng. rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/60">
              {top.map((c) => (
                <tr key={c.id}>
                  <td className="py-3 pr-3">{c.title}</td>
                  <td className="py-3 pr-3 text-brand-muted">{c.publishedAt}</td>
                  <td className="py-3 pr-3 text-right font-medium">{formatNumber(c.impressions)}</td>
                  <td className="py-3 pr-3 text-right">{formatNumber(c.engagement)}</td>
                  <td className="py-3 text-right text-brand-muted">{formatPercent(c.engagementRate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
