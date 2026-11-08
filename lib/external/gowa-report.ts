export interface GowaReport {
  title: string
  period: string
  lines: string[]
  top?: Array<{
    rank: number
    label: string
    reposts: number
    shares: number
    likes: number
    replies: number
  }>
}

export function formatGowaReport(report: GowaReport): string {
  const ranking = (report.top ?? []).map((item) =>
    `${item.rank}. ${item.label} — réplicas ${item.reposts}, compartilhamentos ${item.shares}, curtidas ${item.likes}, respostas ${item.replies}`
  )
  return [
    `📊 ${report.title}`,
    `Período: ${report.period}`,
    ...report.lines,
    ranking.length ? `Top circulação:\n${ranking.join('\n')}` : '',
  ].filter(Boolean).join('\n\n')
}

export async function sendGowaReport(message: string): Promise<void> {
  const url = process.env.GOWA_REPORT_URL
  const token = process.env.GOWA_REPORT_TOKEN
  if (!url || !token) throw new Error('GOWA_REPORT_URL and GOWA_REPORT_TOKEN are required')
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${token}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({ message }),
  })
  if (!response.ok) throw new Error(`gowa_report_http_${response.status}`)
}
