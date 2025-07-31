'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useObras } from "@/hooks/obras/use-obras"
import { Suspense } from "react"

function LoadingChartSkeleton() {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Progresso por Obra</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <div className="h-[300px] w-full animate-pulse rounded-md bg-muted" />
      </CardContent>
    </Card>
  )
}

export function ProgressChart() {
  const { data: obras } = useObras()

  const data = obras?.map((obra) => ({
    nome: obra.nome,
    percentual: (Number(obra.totalGeral) / Number(obra.totalExecutado)) * 100,
  }))

  return (
    <Suspense fallback={<LoadingChartSkeleton />}>
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Progresso por Obra</CardTitle>
        </CardHeader>
        <CardContent className="pl-2">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="nome" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} />
              <Tooltip formatter={(value) => [`${value}%`, "Percentual Executado"]} />
              <Bar dataKey="percentual" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </Suspense>
  )
}
