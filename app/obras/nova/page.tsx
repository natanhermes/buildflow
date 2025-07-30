"use client"

import type React from "react"

import { useState } from "react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Plus, Trash2 } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

interface Torre {
  id: string
  nome: string
  pavimentos: Pavimento[]
}

interface Pavimento {
  id: string
  identificador: string
  area: number
}

export default function NovaObraPage() {
  const { toast } = useToast()
  const [torres, setTorres] = useState<Torre[]>([])
  const [formData, setFormData] = useState({
    nome: "",
    cei: "",
    endereco: "",
    valor_m2: "",
    data_inicio: "",
    data_fim: "",
    total_m2: "",
    total_m3: "",
  })

  const adicionarTorre = () => {
    const novaTorre: Torre = {
      id: Date.now().toString(),
      nome: `Torre ${torres.length + 1}`,
      pavimentos: [],
    }
    setTorres([...torres, novaTorre])
  }

  const removerTorre = (torreId: string) => {
    setTorres(torres.filter((torre) => torre.id !== torreId))
  }

  const adicionarPavimento = (torreId: string) => {
    setTorres(
      torres.map((torre) => {
        if (torre.id === torreId) {
          const novoPavimento: Pavimento = {
            id: Date.now().toString(),
            identificador: `Pavimento ${torre.pavimentos.length + 1}`,
            area: 0,
          }
          return {
            ...torre,
            pavimentos: [...torre.pavimentos, novoPavimento],
          }
        }
        return torre
      }),
    )
  }

  const removerPavimento = (torreId: string, pavimentoId: string) => {
    setTorres(
      torres.map((torre) => {
        if (torre.id === torreId) {
          return {
            ...torre,
            pavimentos: torre.pavimentos.filter((pav) => pav.id !== pavimentoId),
          }
        }
        return torre
      }),
    )
  }

  const atualizarTorre = (torreId: string, nome: string) => {
    setTorres(torres.map((torre) => (torre.id === torreId ? { ...torre, nome } : torre)))
  }

  const atualizarPavimento = (torreId: string, pavimentoId: string, field: string, value: string | number) => {
    setTorres(
      torres.map((torre) => {
        if (torre.id === torreId) {
          return {
            ...torre,
            pavimentos: torre.pavimentos.map((pav) => (pav.id === pavimentoId ? { ...pav, [field]: value } : pav)),
          }
        }
        return torre
      }),
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Obra criada com sucesso!",
      description: "A nova obra foi cadastrada no sistema.",
    })
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <SidebarTrigger />
          <Button variant="ghost" size="sm" asChild>
            <Link href="/obras">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Link>
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">Nova Obra</h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informações Básicas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome da Obra</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  placeholder="Digite o nome da obra"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cei">CEI</Label>
                <Input
                  id="cei"
                  value={formData.cei}
                  onChange={(e) => setFormData({ ...formData, cei: e.target.value })}
                  placeholder="00.000.000/0000-00"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="endereco">Endereço</Label>
              <Textarea
                id="endereco"
                value={formData.endereco}
                onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                placeholder="Digite o endereço completo"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="data_inicio">Data de Início</Label>
                <Input
                  id="data_inicio"
                  type="date"
                  value={formData.data_inicio}
                  onChange={(e) => setFormData({ ...formData, data_inicio: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="data_fim">Data de Fim</Label>
                <Input
                  id="data_fim"
                  type="date"
                  value={formData.data_fim}
                  onChange={(e) => setFormData({ ...formData, data_fim: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="valor_m2">Valor por m²</Label>
                <Input
                  id="valor_m2"
                  type="number"
                  value={formData.valor_m2}
                  onChange={(e) => setFormData({ ...formData, valor_m2: e.target.value })}
                  placeholder="0.00"
                  step="0.01"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="total_m2">Total m²</Label>
                <Input
                  id="total_m2"
                  type="number"
                  value={formData.total_m2}
                  onChange={(e) => setFormData({ ...formData, total_m2: e.target.value })}
                  placeholder="0"
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
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Torres e Pavimentos</CardTitle>
              <Button type="button" onClick={adicionarTorre} variant="outline" size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Torre
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {torres.map((torre) => (
              <Card key={torre.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Input
                      value={torre.nome}
                      onChange={(e) => atualizarTorre(torre.id, e.target.value)}
                      className="max-w-xs"
                    />
                    <div className="flex gap-2">
                      <Button type="button" onClick={() => adicionarPavimento(torre.id)} variant="outline" size="sm">
                        <Plus className="mr-2 h-4 w-4" />
                        Pavimento
                      </Button>
                      <Button type="button" onClick={() => removerTorre(torre.id)} variant="destructive" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {torre.pavimentos.map((pavimento) => (
                      <div key={pavimento.id} className="flex items-center gap-2 p-2 border rounded">
                        <Input
                          value={pavimento.identificador}
                          onChange={(e) => atualizarPavimento(torre.id, pavimento.id, "identificador", e.target.value)}
                          placeholder="Identificador"
                          className="flex-1"
                        />
                        <Input
                          type="number"
                          value={pavimento.area}
                          onChange={(e) =>
                            atualizarPavimento(torre.id, pavimento.id, "area", Number.parseFloat(e.target.value) || 0)
                          }
                          placeholder="Área (m²)"
                          className="w-32"
                        />
                        <Button
                          type="button"
                          onClick={() => removerPavimento(torre.id, pavimento.id)}
                          variant="destructive"
                          size="sm"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" asChild>
            <Link href="/obras">Cancelar</Link>
          </Button>
          <Button type="submit">Criar Obra</Button>
        </div>
      </form>
    </div>
  )
}
