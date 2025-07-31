import { MetricsCards } from "@/components/dashboard/metrics-cards"
import { ProgressChart } from "@/components/dashboard/progress-chart"
import { RecentActivities } from "@/components/dashboard/recent-activities"
import { mockDashboardMetrics } from "@/lib/mock-data"

export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between space-y-2">
        <div className="flex items-center space-x-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        </div>
      </div>

      <div className="space-y-4">
        <MetricsCards metrics={mockDashboardMetrics} />

        <div className="grid gap-4 md:grid-cols-2">
          <ProgressChart />
          {/* <RecentActivities atividades={mockAtividades} /> */}
        </div>
      </div>
    </div>
  )
}
