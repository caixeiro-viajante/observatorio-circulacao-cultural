import { buildDailyReport } from '@/lib/reports/build-daily'
import { DailyReportView } from '@/components/daily-report'
import { SendReport } from '@/components/send-report'

export const dynamic = 'force-dynamic'

export const metadata = { title: 'Daily report' }

export default async function ReportPage() {
  const report = await buildDailyReport()

  return (
    <div className="space-y-6">
      <div className="no-print flex items-center justify-end">
        <SendReport />
      </div>
      <DailyReportView report={report} />
    </div>
  )
}
