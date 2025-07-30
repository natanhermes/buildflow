import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Square, TrendingUp, Beaker } from "lucide-react"
import type { DashboardMetrics } from "@/lib/types"

interface MetricsCardsProps {
  metrics: DashboardMetrics
}

export function MetricsCards({ metrics }: MetricsCardsProps) {
  const cards = [
    {
      title: "Obras Ativas",
      value: metrics.obras_ativas,
      icon: Building2,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Total m² Executado",
      value: metrics.total_m2_executado.toLocaleString(),
      icon: Square,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "% Médio Executado",
      value: `${metrics.percentual_medio_executado}%`,
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      title: "Total de Aditivos",
      value: `${metrics.total_aditivos}m³`,
      icon: Beaker,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <div className={`p-2 rounded-full ${card.bgColor}`}>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
