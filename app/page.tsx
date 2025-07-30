import { SidebarTrigger } from "@/components/ui/sidebar"
import { MetricsCards } from "@/components/dashboard/metrics-cards"
import { ProgressChart } from "@/components/dashboard/progress-chart"
import { RecentActivities } from "@/components/dashboard/recent-activities"
import { mockDashboardMetrics, mockObras, mockAtividades } from "@/lib/mock-data"

export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div className="flex items-center space-x-2">
          <SidebarTrigger />
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        </div>
      </div>

      <div className="space-y-4">
        <MetricsCards metrics={mockDashboardMetrics} />

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <ProgressChart obras={mockObras} />
          <RecentActivities atividades={mockAtividades} />
        </div>
      </div>
    </div>
  )
}
