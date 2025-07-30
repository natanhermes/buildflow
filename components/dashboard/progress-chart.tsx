"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import type { Obra } from "@/lib/types"

interface ProgressChartProps {
  obras: Obra[]
}

export function ProgressChart({ obras }: ProgressChartProps) {
  const data = obras.map((obra) => ({
    nome: obra.nome.length > 15 ? obra.nome.substring(0, 15) + "..." : obra.nome,
    percentual: Math.floor(Math.random() * 100), // Mock data - em produção seria calculado
  }))

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Progresso por Obra</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={350}>
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
  )
}
