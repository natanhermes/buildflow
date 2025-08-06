"use client"

import { useState, useMemo, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Loader2, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useActionState } from 'react'
import { createAtividadeAction, type ActionState } from '../actions'
import { IntegrantesModal } from "@/components/atividades/integrantes-modal"
import { useObrasForAtividades, usePavimentosByObra } from "@/hooks/atividades/use-atividades-form"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function NovaAtividadePage() {
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    createAtividadeAction,
    { success: false }
  )

  // Estados para campos controlados
  const [selectedObra, setSelectedObra] = useState("")
  const [selectedPavimento, setSelectedPavimento] = useState("")
  const [selectedIntegrantes, setSelectedIntegrantes] = useState<string[]>([])
  
  // Estados para todos os campos do formulário (preservados após erro)
  const [formData, setFormData] = useState({
    dataExecucao: "",
    areaExecutadaM2: "",
    aditivoM3: "",
    aditivoL: "",
    execucao: "",
    inicioExpediente: "",
    inicioAlmoco: "",
    fimAlmoco: "",
    fimExpediente: "",
    obsExecucao: "",
    obsPonto: "",
    obsQtdBetoneira: "",
    obsHOI: "",
  })

  // Ref para o formulário
  const formRef = useRef<HTMLFormElement>(null)

  // React Query hooks
  const { 
    data: obras = [], 
    isLoading: isLoadingObras, 
    error: obrasError 
  } = useObrasForAtividades()

  const { 
    data: pavimentos = [], 
    isLoading: isLoadingPavimentos, 
    error: pavimentosError 
  } = usePavimentosByObra(selectedObra || null)

  // Reset pavimento selection when obra changes
  const handleObraChange = (obraId: string) => {
    setSelectedObra(obraId)
    setSelectedPavimento("") // Reset pavimento when obra changes
  }

  // Função para atualizar campos do formulário (com useCallback para performance)
  const updateFormData = useCallback((field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }, [])

  // Reset form apenas em caso de sucesso
  useEffect(() => {
    if (state?.success) {
      setSelectedObra("")
      setSelectedPavimento("")
      setSelectedIntegrantes([])
      setFormData({
        dataExecucao: "",
        areaExecutadaM2: "",
        aditivoM3: "",
        aditivoL: "",
        execucao: "",
        inicioExpediente: "",
        inicioAlmoco: "",
        fimAlmoco: "",
        fimExpediente: "",
        obsExecucao: "",
        obsPonto: "",
        obsQtdBetoneira: "",
        obsHOI: "",
      })
      if (formRef.current) {
        formRef.current.reset()
      }
    }
  }, [state?.success])

  // Get selected pavimento data for calculations
  const selectedPavimentoData = pavimentos.find(p => p.id === selectedPavimento)

  // Calculate percentual and espessura in real time
  const calculations = useMemo(() => {
    if (!selectedPavimentoData || !formData.areaExecutadaM2 || Number(formData.areaExecutadaM2) <= 0) {
      return { percentualExecutado: 0, espessuraCM: 0 }
    }

    const areaExec = Number(formData.areaExecutadaM2)
    const areaTotal = Number(selectedPavimentoData.areaM2)
    const argamassa = Number(selectedPavimentoData.argamassaM3)

    const percentualExecutado = (areaExec / areaTotal) * 100
    const espessuraCM = (argamassa / areaExec) * 100

    return {
      percentualExecutado: Math.round(percentualExecutado * 100) / 100, // 2 decimal places
      espessuraCM: Math.round(espessuraCM * 100) / 100 // 2 decimal places
    }
  }, [selectedPavimentoData, formData.areaExecutadaM2])

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

      {/* Error handling */}
      {obrasError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Erro ao carregar obras: {obrasError.message}
          </AlertDescription>
        </Alert>
      )}

      {pavimentosError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Erro ao carregar pavimentos: {pavimentosError.message}
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Informações da Atividade</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Show loading state if obras are still loading */}
          {isLoadingObras ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Carregando dados...</span>
            </div>
          ) : (
            <form ref={formRef} action={formAction} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="obraId">Obra *</Label>
                <Select 
                  name="obraId" 
                  value={selectedObra} 
                  onValueChange={handleObraChange}
                  required
                  disabled={isLoadingObras}
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
                <Select 
                  name="pavimentoId" 
                  value={selectedPavimento}
                  onValueChange={setSelectedPavimento}
                  required
                  disabled={!selectedObra || isLoadingPavimentos}
                >
                  <SelectTrigger>
                    {isLoadingPavimentos && selectedObra ? (
                      <div className="flex items-center">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Carregando pavimentos...
                      </div>
                    ) : (
                      <SelectValue placeholder={
                        !selectedObra 
                          ? "Selecione primeiro a obra"
                          : pavimentos.length === 0
                            ? "Nenhum pavimento encontrado"
                            : "Selecione o pavimento"
                      } />
                    )}
                  </SelectTrigger>
                  <SelectContent>
                    {pavimentos.length === 0 && selectedObra && !isLoadingPavimentos ? (
                      <div className="px-2 py-1 text-sm text-muted-foreground">
                        Nenhum pavimento encontrado para esta obra
                      </div>
                    ) : (
                      pavimentos.map((pavimento) => (
                        <SelectItem key={pavimento.id} value={pavimento.id}>
                          {pavimento.torre.nome} - {pavimento.identificador} ({pavimento.areaM2}m²)
                        </SelectItem>
                      ))
                    )}
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
                <Select 
                  name="execucao" 
                  value={formData.execucao} 
                  onValueChange={(value) => updateFormData('execucao', value)}
                >
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

            {/* Campos do Pavimento */}
            {selectedPavimentoData && (
              <div className="space-y-4">
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium mb-4">Dados do Pavimento</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="dataExecucao">Data de Execução *</Label>
                      <Input
                        id="dataExecucao"
                        name="dataExecucao"
                        type="date"
                        value={formData.dataExecucao}
                        onChange={(e) => updateFormData('dataExecucao', e.target.value)}
                        required
                      />
                      {state?.fieldErrors?.dataExecucao && (
                        <p className="text-sm text-red-500">{state.fieldErrors.dataExecucao[0]}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="areaExecutadaM2">Área Executada (m²) *</Label>
                      <Input
                        id="areaExecutadaM2"
                        name="areaExecutadaM2"
                        type="number"
                        step="0.01"
                        min="0.01"
                        max={selectedPavimentoData.areaM2}
                        placeholder={`Máximo: ${selectedPavimentoData.areaM2}m²`}
                        value={formData.areaExecutadaM2}
                        onChange={(e) => updateFormData('areaExecutadaM2', e.target.value)}
                        required
                      />
                      {state?.fieldErrors?.areaExecutadaM2 && (
                        <p className="text-sm text-red-500">{state.fieldErrors.areaExecutadaM2[0]}</p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Área total do pavimento: {selectedPavimentoData.areaM2}m²
                      </p>
                    </div>
                  </div>
                  
                  {/* Cálculos Automáticos */}
                  {formData.areaExecutadaM2 && Number(formData.areaExecutadaM2) > 0 && (
                    <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                      <h4 className="text-sm font-medium mb-3">Cálculos Automáticos</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">Percentual Executado</Label>
                          <p className="text-sm font-medium">
                            {calculations.percentualExecutado.toFixed(2)}%
                          </p>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">Espessura (cm)</Label>
                          <p className="text-sm font-medium">
                            {calculations.espessuraCM.toFixed(2)} cm
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

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
                  value={formData.aditivoM3}
                  onChange={(e) => updateFormData('aditivoM3', e.target.value)}
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
                  value={formData.aditivoL}
                  onChange={(e) => updateFormData('aditivoL', e.target.value)}
                />
                {state?.fieldErrors?.aditivoL && (
                  <p className="text-sm text-red-500">{state.fieldErrors.aditivoL[0]}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="space-y-2">
                <Label htmlFor="inicioExpediente">Início Expediente</Label>
                <Input
                  id="inicioExpediente"
                  name="inicioExpediente"
                  type="time"
                  value={formData.inicioExpediente}
                  onChange={(e) => updateFormData('inicioExpediente', e.target.value)}
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
                  value={formData.inicioAlmoco}
                  onChange={(e) => updateFormData('inicioAlmoco', e.target.value)}
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
                  value={formData.fimAlmoco}
                  onChange={(e) => updateFormData('fimAlmoco', e.target.value)}
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
                  value={formData.fimExpediente}
                  onChange={(e) => updateFormData('fimExpediente', e.target.value)}
                />
                {state?.fieldErrors?.fimExpediente && (
                  <p className="text-sm text-red-500">{state.fieldErrors.fimExpediente[0]}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="obsExecucao">Observações da Execução</Label>
                <Textarea
                  id="obsExecucao"
                  name="obsExecucao"
                  rows={3}
                  placeholder="Observações sobre a execução..."
                  value={formData.obsExecucao}
                  onChange={(e) => updateFormData('obsExecucao', e.target.value)}
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
                  value={formData.obsPonto}
                  onChange={(e) => updateFormData('obsPonto', e.target.value)}
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
                  value={formData.obsQtdBetoneira}
                  onChange={(e) => updateFormData('obsQtdBetoneira', e.target.value)}
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
                  value={formData.obsHOI}
                  onChange={(e) => updateFormData('obsHOI', e.target.value)}
                />
                {state?.fieldErrors?.obsHOI && (
                  <p className="text-sm text-red-500">{state.fieldErrors.obsHOI[0]}</p>
                )}
              </div>
            </div>

            {state?.error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600 font-medium">{state.error}</p>
                <p className="text-xs text-red-500 mt-1">
                  ℹ️ Seus dados foram preservados. Corrija os erros e tente novamente.
                </p>
              </div>
            )}

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" asChild>
                <Link href="/atividades">Cancelar</Link>
              </Button>
              <Button 
                type="submit" 
                disabled={
                  isPending || 
                  isLoadingObras || 
                  (!!selectedObra && isLoadingPavimentos) ||
                  !selectedPavimento ||
                  !formData.areaExecutadaM2 ||
                  Number(formData.areaExecutadaM2) <= 0
                }
              >
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Criar Atividade
              </Button>
            </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}