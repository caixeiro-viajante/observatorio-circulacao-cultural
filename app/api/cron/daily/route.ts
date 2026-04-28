import { NextResponse } from 'next/server'
import { buildDailyReport } from '@/lib/reports/build-daily'
import { sendToSlack } from '@/lib/reports/slack'
import { sendToDiscord } from '@/lib/reports/discord'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const expected = process.env.CRON_SECRET
  if (expected) {
    const auth = request.headers.get('authorization') ?? ''
    if (auth !== `Bearer ${expected}`) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
    }
  }

  const slackUrl = process.env.SLACK_WEBHOOK_URL
  const discordUrl = process.env.DISCORD_WEBHOOK_URL
  if (!slackUrl && !discordUrl) {
    return NextResponse.json(
      { error: 'no webhook configured (set SLACK_WEBHOOK_URL or DISCORD_WEBHOOK_URL)' },
      { status: 400 },
    )
  }

  const report = await buildDailyReport()
  const results: Record<string, string> = {}
  try {
    if (slackUrl) {
      await sendToSlack(report, slackUrl)
      results.slack = 'sent'
    }
    if (discordUrl) {
      await sendToDiscord(report, discordUrl)
      results.discord = 'sent'
    }
  } catch (err) {
    return NextResponse.json({ error: String(err), partial: results }, { status: 502 })
  }

  return NextResponse.json({ ok: true, date: report.date, results })
}
