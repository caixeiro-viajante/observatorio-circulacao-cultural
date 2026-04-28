import { CheckCircle2, AlertCircle } from 'lucide-react'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BrandingPanel } from '@/components/branding-panel'
import { isPlatformConnected, PLATFORM_IDS } from '@/lib/adapters'
import { PLATFORM_META } from '@/lib/adapters/types'
import { getBrand } from '@/lib/brand'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Settings' }

const PLATFORM_ENV: Record<string, string> = {
  x: 'X_BEARER_TOKEN',
  youtube: 'YOUTUBE_API_KEY',
  linkedin: 'LINKEDIN_ACCESS_TOKEN',
  instagram: 'IG_ACCESS_TOKEN',
  tiktok: 'TIKTOK_ACCESS_TOKEN',
}

function maskedWebhook(value: string | undefined): string {
  if (!value) return 'Not configured'
  if (value.length < 20) return '*****'
  return `${value.slice(0, 24)}…${value.slice(-6)}`
}

export default function SettingsPage() {
  const brand = getBrand()
  const slack = process.env.SLACK_WEBHOOK_URL
  const discord = process.env.DISCORD_WEBHOOK_URL
  const cronConfigured = Boolean(process.env.CRON_SECRET)
  const demoMode = process.env.DEMO_MODE === 'true'

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Settings</h1>
        <p className="mt-1 text-brand-muted">Connection status, branding, and delivery configuration.</p>
      </header>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Platform connections</CardTitle>
            <CardDescription>
              Each platform uses mock data until its credentials are set in your <code className="text-brand-fg">.env.local</code>.
              {demoMode && ' DEMO_MODE=true is forcing all platforms to mock.'}
            </CardDescription>
          </div>
        </CardHeader>
        <ul className="divide-y divide-brand-border/60">
          {PLATFORM_IDS.map((id) => {
            const connected = isPlatformConnected(id)
            return (
              <li key={id} className="flex items-center justify-between py-3">
                <div>
                  <div className="font-medium">{PLATFORM_META[id].name}</div>
                  <div className="text-xs text-brand-muted">
                    Reads <code className="text-brand-fg">{PLATFORM_ENV[id]}</code>
                  </div>
                </div>
                <Badge tone={connected ? 'live' : 'demo'}>
                  {connected ? (
                    <>
                      <CheckCircle2 className="h-3 w-3" /> LIVE
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-3 w-3" /> DEMO
                    </>
                  )}
                </Badge>
              </li>
            )
          })}
        </ul>
      </Card>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Daily report delivery</CardTitle>
            <CardDescription>Webhook destinations and the daily cron secret.</CardDescription>
          </div>
        </CardHeader>
        <ul className="divide-y divide-brand-border/60">
          <Row label="Slack webhook" value={maskedWebhook(slack)} ok={Boolean(slack)} env="SLACK_WEBHOOK_URL" />
          <Row label="Discord webhook" value={maskedWebhook(discord)} ok={Boolean(discord)} env="DISCORD_WEBHOOK_URL" />
          <Row
            label="Cron secret"
            value={cronConfigured ? 'Configured' : 'Not configured'}
            ok={cronConfigured}
            env="CRON_SECRET"
          />
        </ul>
      </Card>

      <BrandingPanel defaultPrimary={brand.colors.primary} defaultAccent={brand.colors.accent} />
    </div>
  )
}

function Row({
  label,
  value,
  ok,
  env,
}: {
  label: string
  value: string
  ok: boolean
  env: string
}) {
  return (
    <li className="flex items-center justify-between py-3">
      <div>
        <div className="font-medium">{label}</div>
        <div className="text-xs text-brand-muted">
          Reads <code className="text-brand-fg">{env}</code>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="font-mono text-xs text-brand-muted">{value}</span>
        <Badge tone={ok ? 'success' : 'default'}>{ok ? 'OK' : 'PENDING'}</Badge>
      </div>
    </li>
  )
}
