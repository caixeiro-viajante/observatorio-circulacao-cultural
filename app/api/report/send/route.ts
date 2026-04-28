import { NextResponse } from 'next/server'
import { z } from 'zod'
import { buildDailyReport } from '@/lib/reports/build-daily'
import { sendToSlack } from '@/lib/reports/slack'
import { sendToDiscord } from '@/lib/reports/discord'

const Body = z.object({
  channel: z.enum(['slack', 'discord']),
  webhookUrl: z.string().url().optional(),
})

export async function POST(request: Request) {
  let body: z.infer<typeof Body>
  try {
    body = Body.parse(await request.json())
  } catch (err) {
    return NextResponse.json({ error: 'invalid body', details: String(err) }, { status: 400 })
  }

  const url =
    body.webhookUrl ??
    (body.channel === 'slack' ? process.env.SLACK_WEBHOOK_URL : process.env.DISCORD_WEBHOOK_URL)
  if (!url) {
    return NextResponse.json(
      { error: `${body.channel.toUpperCase()}_WEBHOOK_URL is not configured` },
      { status: 400 },
    )
  }

  const report = await buildDailyReport()
  try {
    if (body.channel === 'slack') await sendToSlack(report, url)
    else await sendToDiscord(report, url)
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 502 })
  }

  return NextResponse.json({ ok: true, date: report.date })
}
