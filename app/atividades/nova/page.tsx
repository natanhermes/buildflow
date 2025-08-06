"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { useActionState } from 'react'
import { createAtividadeAction, type ActionState } from '../actions'
import { IntegrantesModal } from "@/components/atividades/integrantes-modal"

type Obra = {
  id: string
  nome: string
  cei: string
}

type Pavimento = {
  id: string
  identificador: string
  areaM2: string
  torre: {
    id: string
    nome: string
  }
}



export default function NovaAtividadePage() {
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    createAtividadeAction,
    { success: false }
  )

  const [obras, setObras] = useState<Obra[]>([])
  const [pavimentos, setPavimentos] = useState<Pavimento[]>([])
  const [selectedObra, setSelectedObra] = useState("")
  const [selectedIntegrantes, setSelectedIntegrantes] = useState<string[]>([])
  const [loadingPavimentos, setLoadingPavimentos] = useState(false)

  // Carregar obras
  useEffect(() => {
    const loadData = async () => {
      try {
        const obrasRes = await fetch('/api/atividades/obras')

        if (obrasRes.ok) {
          const obrasData = await obrasRes.json()
          setObras(obrasData)
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error)
      }
    }

    loadData()
  }, [])

  // Carregar pavimentos quando obra for selecionada
  useEffect(() => {
    if (selectedObra) {
      setLoadingPavimentos(true)
      fetch(`/api/atividades/pavimentos?obraId=${selectedObra}`)
        .then(res => res.json())
        .then(data => {
          setPavimentos(data)
        })
        .catch(error => {
          console.error('Erro ao carregar pavimentos:', error)
        })
        .finally(() => {
          setLoadingPavimentos(false)
        })
    } else {
      setPavimentos([])
    }
  }, [selectedObra])

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/atividades">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Link>
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">Nova Atividade</h2>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações da Atividade</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-6">
            {/* Informações principais */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="obraId">Obra *</Label>
                <Select 
                  name="obraId" 
                  value={selectedObra} 
                  onValueChange={setSelectedObra}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a obra" />
                  </SelectTrigger>
                  <SelectContent>
                    {obras.map((obra) => (
                      <SelectItem key={obra.id} value={obra.id}>
                        {obra.nome} - {obra.cei}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {state?.fieldErrors?.obraId && (
                  <p className="text-sm text-red-500">{state.fieldErrors.obraId[0]}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="pavimentoId">Pavimento *</Label>
                <Select name="pavimentoId" required>
                  <SelectTrigger>
                    <SelectValue placeholder={
                      selectedObra 
                        ? loadingPavimentos 
                          ? "Carregando pavimentos..." 
                          : "Selecione o pavimento"
                        : "Selecione primeiro a obra"
                    } />
                  </SelectTrigger>
                  <SelectContent>
                    {pavimentos.map((pavimento) => (
                      <SelectItem key={pavimento.id} value={pavimento.id}>
                        {pavimento.torre.nome} - {pavimento.identificador} ({pavimento.areaM2}m²)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {state?.fieldErrors?.pavimentoId && (
                  <p className="text-sm text-red-500">{state.fieldErrors.pavimentoId[0]}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="integranteIds">Integrantes *</Label>
                <IntegrantesModal 
                  selectedIntegrantes={selectedIntegrantes}
                  onSelectionChange={setSelectedIntegrantes}
                />
                {/* Hidden inputs para enviar os integrantes selecionados */}
                {selectedIntegrantes.map((integranteId) => (
                  <input
                    key={integranteId}
                    type="hidden"
                    name="integranteIds"
                    value={integranteId}
                  />
                ))}
                {state?.fieldErrors?.integranteIds && (
                  <p className="text-sm text-red-500">{state.fieldErrors.integranteIds[0]}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="execucao">Status de Execução</Label>
                <Select name="execucao">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INICIAL">Inicial</SelectItem>
                    <SelectItem value="MEIO">Em andamento</SelectItem>
                    <SelectItem value="FINAL">Final</SelectItem>
                    <SelectItem value="EXECUTADO">Executado</SelectItem>
                  </SelectContent>
                </Select>
                {state?.fieldErrors?.execucao && (
                  <p className="text-sm text-red-500">{state.fieldErrors.execucao[0]}</p>
                )}
              </div>
            </div>

            {/* Aditivos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="aditivoM3">Aditivo M³</Label>
                <Input
                  id="aditivoM3"
                  name="aditivoM3"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                />
                {state?.fieldErrors?.aditivoM3 && (
                  <p className="text-sm text-red-500">{state.fieldErrors.aditivoM3[0]}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="aditivoL">Aditivo L</Label>
                <Input
                  id="aditivoL"
                  name="aditivoL"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                />
                {state?.fieldErrors?.aditivoL && (
                  <p className="text-sm text-red-500">{state.fieldErrors.aditivoL[0]}</p>
                )}
              </div>
            </div>

            {/* Horários */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="space-y-2">
                <Label htmlFor="inicioExpediente">Início Expediente</Label>
                <Input
                  id="inicioExpediente"
                  name="inicioExpediente"
                  type="time"
                />
                {state?.fieldErrors?.inicioExpediente && (
                  <p className="text-sm text-red-500">{state.fieldErrors.inicioExpediente[0]}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="inicioAlmoco">Início Almoço</Label>
                <Input
                  id="inicioAlmoco"
                  name="inicioAlmoco"
                  type="time"
                />
                {state?.fieldErrors?.inicioAlmoco && (
                  <p className="text-sm text-red-500">{state.fieldErrors.inicioAlmoco[0]}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="fimAlmoco">Fim Almoço</Label>
                <Input
                  id="fimAlmoco"
                  name="fimAlmoco"
                  type="time"
                />
                {state?.fieldErrors?.fimAlmoco && (
                  <p className="text-sm text-red-500">{state.fieldErrors.fimAlmoco[0]}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="fimExpediente">Fim Expediente</Label>
                <Input
                  id="fimExpediente"
                  name="fimExpediente"
                  type="time"
                />
                {state?.fieldErrors?.fimExpediente && (
                  <p className="text-sm text-red-500">{state.fieldErrors.fimExpediente[0]}</p>
                )}
              </div>
            </div>

            {/* Observações */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="obsExecucao">Observações da Execução</Label>
                <Textarea
                  id="obsExecucao"
                  name="obsExecucao"
                  rows={3}
                  placeholder="Observações sobre a execução..."
                />
                {state?.fieldErrors?.obsExecucao && (
                  <p className="text-sm text-red-500">{state.fieldErrors.obsExecucao[0]}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="obsPonto">Observações do Ponto</Label>
                <Textarea
                  id="obsPonto"
                  name="obsPonto"
                  rows={3}
                  placeholder="Observações sobre o ponto..."
                />
                {state?.fieldErrors?.obsPonto && (
                  <p className="text-sm text-red-500">{state.fieldErrors.obsPonto[0]}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="obsQtdBetoneira">Observações da Betoneira</Label>
                <Textarea
                  id="obsQtdBetoneira"
                  name="obsQtdBetoneira"
                  rows={3}
                  placeholder="Observações sobre a quantidade de betoneira..."
                />
                {state?.fieldErrors?.obsQtdBetoneira && (
                  <p className="text-sm text-red-500">{state.fieldErrors.obsQtdBetoneira[0]}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="obsHOI">Observações HOI</Label>
                <Textarea
                  id="obsHOI"
                  name="obsHOI"
                  rows={3}
                  placeholder="Observações HOI..."
                />
                {state?.fieldErrors?.obsHOI && (
                  <p className="text-sm text-red-500">{state.fieldErrors.obsHOI[0]}</p>
                )}
              </div>
            </div>

            {state?.error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{state.error}</p>
              </div>
            )}

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" asChild>
                <Link href="/atividades">Cancelar</Link>
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Criar Atividade
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}