import { getAllAdapters } from '@/lib/adapters'
import { aggregateOverview, sumTimeSeries } from '@/lib/metrics/aggregate'
import { lastNDays } from '@/lib/date'
import { KpiCard } from '@/components/kpi-card'
import { PlatformTile } from '@/components/platform-tile'
import { LineChart } from '@/components/charts/line-chart'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getBrand } from '@/lib/brand'
import { formatDelta } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function OverviewPage() {
  const range = lastNDays(30)
  const priorRange = lastNDays(30, new Date(range.start.getTime() - 1))
  const adapters = getAllAdapters()

  const overviews = await Promise.all(adapters.map((a) => a.getOverview(range)))
  const priorOverviews = await Promise.all(adapters.map((a) => a.getOverview(priorRange)))
  const series = await Promise.all(adapters.map((a) => a.getTimeSeries(range)))

  const agg = aggregateOverview(overviews)
  const priorAgg = aggregateOverview(priorOverviews)
  const totalSeries = sumTimeSeries(series)
  const brand = getBrand()

  const anyLive = adapters.some((a) => a.source === 'live')

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Overview</h1>
          <p className="mt-1 text-brand-muted">
            Last 30 days across {adapters.length} platforms · {brand.tagline}
          </p>
        </div>
        <Badge tone={anyLive ? 'live' : 'demo'}>
          {anyLive ? 'PARTIAL LIVE DATA' : 'DEMO MODE'}
        </Badge>
      </header>

      <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <KpiCard
          label="Total followers"
          value={agg.followers}
          delta={formatDelta(agg.followers, priorAgg.followers)}
        />
        <KpiCard
          label="Impressions"
          value={agg.impressions}
          delta={formatDelta(agg.impressions, priorAgg.impressions)}
        />
        <KpiCard
          label="Engagement rate"
          value={agg.engagementRate}
          format="percent"
          delta={formatDelta(agg.engagementRate, priorAgg.engagementRate)}
        />
        <KpiCard
          label="Posts"
          value={agg.posts}
          delta={formatDelta(agg.posts, priorAgg.posts)}
        />
      </section>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Daily impressions across all platforms</CardTitle>
            <CardDescription>Aggregated time series, last 30 days</CardDescription>
          </div>
        </CardHeader>
        <LineChart
          data={totalSeries}
          xKey="date"
          series={[
            { key: 'impressions', label: 'Impressions', color: 'rgb(var(--brand-primary))' },
            { key: 'engagement', label: 'Engagement', color: 'rgb(var(--brand-accent))' },
          ]}
        />
      </Card>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">By platform</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {adapters.map((a, i) => (
            <PlatformTile key={a.meta.id} meta={a.meta} overview={overviews[i]} source={a.source} />
          ))}
        </div>
      </section>
    </div>
  )
}
