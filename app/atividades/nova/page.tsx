"use client"

import type React from "react"

import { useState } from "react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { mockObras } from "@/lib/mock-data"

export default function NovaAtividadePage() {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    data: "",
    local: "",
    obra_id: "",
    total_m2: "",
    total_m3: "",
    espessura: "",
    aditivo_m3: "",
    aditivo_l: "",
    saldo_acumulado_m2: "",
    percentual: "",
    execucao: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Atividade criada com sucesso!",
      description: "A nova atividade foi cadastrada no sistema.",
    })
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <SidebarTrigger />
          <Button variant="ghost" size="sm" asChild>
            <Link href="/atividades">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Link>
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">Nova Atividade</h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informações da Atividade</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="data">Data</Label>
                <Input
                  id="data"
                  type="date"
                  value={formData.data}
                  onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="obra">Obra</Label>
                <Select
                  value={formData.obra_id}
                  onValueChange={(value) => setFormData({ ...formData, obra_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma obra" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockObras.map((obra) => (
                      <SelectItem key={obra.id} value={obra.id}>
                        {obra.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="local">Local</Label>
              <Input
                id="local"
                value={formData.local}
                onChange={(e) => setFormData({ ...formData, local: e.target.value })}
                placeholder="Ex: Torre A - 1º Andar"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="execucao">Descrição da Execução</Label>
              <Textarea
                id="execucao"
                value={formData.execucao}
                onChange={(e) => setFormData({ ...formData, execucao: e.target.value })}
                placeholder="Descreva a atividade executada"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="total_m2">Total m²</Label>
                <Input
                  id="total_m2"
                  type="number"
                  value={formData.total_m2}
                  onChange={(e) => setFormData({ ...formData, total_m2: e.target.value })}
                  placeholder="0"
                  step="0.01"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="total_m3">Total m³</Label>
                <Input
                  id="total_m3"
                  type="number"
                  value={formData.total_m3}
                  onChange={(e) => setFormData({ ...formData, total_m3: e.target.value })}
                  placeholder="0"
                  step="0.01"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="espessura">Espessura (m)</Label>
                <Input
                  id="espessura"
                  type="number"
                  value={formData.espessura}
                  onChange={(e) => setFormData({ ...formData, espessura: e.target.value })}
                  placeholder="0.00"
                  step="0.01"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="aditivo_m3">Aditivo m³</Label>
                <Input
                  id="aditivo_m3"
                  type="number"
                  value={formData.aditivo_m3}
                  onChange={(e) => setFormData({ ...formData, aditivo_m3: e.target.value })}
                  placeholder="0"
                  step="0.01"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="aditivo_l">Aditivo Litros</Label>
                <Input
                  id="aditivo_l"
                  type="number"
                  value={formData.aditivo_l}
                  onChange={(e) => setFormData({ ...formData, aditivo_l: e.target.value })}
                  placeholder="0"
                  step="0.01"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="saldo_acumulado_m2">Saldo Acumulado m²</Label>
                <Input
                  id="saldo_acumulado_m2"
                  type="number"
                  value={formData.saldo_acumulado_m2}
                  onChange={(e) => setFormData({ ...formData, saldo_acumulado_m2: e.target.value })}
                  placeholder="0"
                  step="0.01"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="percentual">Percentual (%)</Label>
                <Input
                  id="percentual"
                  type="number"
                  value={formData.percentual}
                  onChange={(e) => setFormData({ ...formData, percentual: e.target.value })}
                  placeholder="0"
                  min="0"
                  max="100"
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" asChild>
            <Link href="/atividades">Cancelar</Link>
          </Button>
          <Button type="submit">Criar Atividade</Button>
        </div>
      </form>
    </div>
  )
}
