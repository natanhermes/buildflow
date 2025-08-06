"use client"

import { useActionState, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { createObraAction } from "../actions"
import { TorresForm } from "./torres-form"
import { withMask } from 'use-mask-input'
import { useCep } from "@/hooks/use-cep"

interface Torre {
  id: string
  nome: string
  pavimentos: Pavimento[]
}

interface Pavimento {
  id: string
  identificador: string
  areaM2: number
  argamassaM3: number
}

export default function NovaObraPage() {
  const [torres, setTorres] = useState<Torre[]>([])
  const [cep, setCep] = useState("")
  const [state, formAction, isPending] = useActionState(createObraAction, {})

  const { data: cepData, isLoading: isLoadingCep, error: cepError } = useCep(cep)

  const handleTorresChange = (novasTorres: Torre[]) => {
    setTorres(novasTorres)
  }

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "")
    const formattedCep = value.replace(/(\d{5})(\d{3})/, "$1-$2")
    setCep(formattedCep)
  }

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/obras">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Link>
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">Nova Obra</h2>
        </div>
      </div>

      {state.error && (
        <div className="p-4 text-sm text-red-500 bg-red-50 border border-red-200 rounded">
          {state.error}
        </div>
      )}

      <form action={formAction} className="space-y-6">
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
                  name="nome"
                  placeholder="Digite o nome da obra"
                  required
                />
                {state.fieldErrors?.nome && (
                  <p className="text-sm text-red-500">{state.fieldErrors.nome[0]}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="cei">CEI</Label>
                <Input
                  id="cei"
                  name="cei"
                  ref={withMask('99.999.99999/99')}
                  placeholder="99.999.99999/99"
                  required
                />
                {state.fieldErrors?.cei && (
                  <p className="text-sm text-red-500">{state.fieldErrors.cei[0]}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="valorM2">Valor por m²</Label>
                <Input
                  id="valorM2"
                  name="valorM2"
                  type="number"
                  placeholder="0.00"
                  step="0.01"
                  required
                />
                {state.fieldErrors?.valorM2 && (
                  <p className="text-sm text-red-500">{state.fieldErrors.valorM2[0]}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="dataInicio">Data de Início</Label>
                <Input
                  id="dataInicio"
                  name="dataInicio"
                  type="date"
                  required
                />
                {state.fieldErrors?.dataInicio && (
                  <p className="text-sm text-red-500">{state.fieldErrors.dataInicio[0]}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="dataFim">Data de Fim</Label>
                <Input
                  id="dataFim"
                  name="dataFim"
                  type="date"
                  required
                />
                {state.fieldErrors?.dataFim && (
                  <p className="text-sm text-red-500">{state.fieldErrors.dataFim[0]}</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="construtora">Construtora</Label>
              <Input
                id="construtora"
                name="construtora"
                type="text"
                placeholder="Digite o nome da construtora"
                required
              />
              {state.fieldErrors?.construtora && (
                <p className="text-sm text-red-500">{state.fieldErrors.construtora[0]}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Endereço</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cep">CEP</Label>
                <div className="relative">
                  <Input
                    id="cep"
                    name="endereco.cep"
                    value={cep}
                    onChange={handleCepChange}
                    placeholder="00000-000"
                    maxLength={9}
                    required
                  />
                  {isLoadingCep && (
                    <Loader2 className="absolute right-2 top-2.5 h-4 w-4 animate-spin text-muted-foreground" />
                  )}
                </div>
                {cepError && (
                  <p className="text-sm text-red-500">CEP não encontrado</p>
                )}
                {state.fieldErrors?.["endereco.cep"] && (
                  <p className="text-sm text-red-500">{state.fieldErrors["endereco.cep"][0]}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="numero">Número</Label>
                <Input
                  id="numero"
                  name="endereco.numero"
                  disabled={!cep}
                  placeholder="123"
                  required
                />
                {state.fieldErrors?.["endereco.numero"] && (
                  <p className="text-sm text-red-500">{state.fieldErrors["endereco.numero"][0]}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="logradouro">Logradouro</Label>
                <Input
                  id="logradouro"
                  name="endereco.logradouro"
                  value={cepData?.logradouro || ""}
                  disabled={!cep}
                  onChange={() => {}} // Handler vazio para campos controlados
                  placeholder="Rua, Avenida, etc."
                  readOnly={!!cepData?.logradouro}
                  required
                />
                {state.fieldErrors?.["endereco.logradouro"] && (
                  <p className="text-sm text-red-500">{state.fieldErrors["endereco.logradouro"][0]}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="complemento">Complemento</Label>
                <Input
                  id="complemento"
                  name="endereco.complemento"
                  disabled={!cep}
                  placeholder="Apartamento, Bloco, etc."
                />
                {state.fieldErrors?.["endereco.complemento"] && (
                  <p className="text-sm text-red-500">{state.fieldErrors["endereco.complemento"][0]}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bairro">Bairro</Label>
                <Input
                  id="bairro"
                  name="endereco.bairro"
                  value={cepData?.bairro || ""}
                  disabled={!cep}
                  onChange={() => {}} // Handler vazio para campos controlados
                  placeholder="Bairro"
                  readOnly={!!cepData?.bairro}
                  required
                />
                {state.fieldErrors?.["endereco.bairro"] && (
                  <p className="text-sm text-red-500">{state.fieldErrors["endereco.bairro"][0]}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="cidade">Cidade</Label>
                <Input
                  id="cidade"
                  name="endereco.cidade"
                  disabled={!cep}
                  value={cepData?.localidade || ""}
                  onChange={() => {}} // Handler vazio para campos controlados
                  placeholder="Cidade"
                  readOnly={!!cepData?.localidade}
                  required
                />
                {state.fieldErrors?.["endereco.cidade"] && (
                  <p className="text-sm text-red-500">{state.fieldErrors["endereco.cidade"][0]}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="estado">Estado</Label>
                <Input
                  id="estado"
                  name="endereco.estado"
                  value={cepData?.uf || ""}
                  disabled={!cep}
                  onChange={() => {}} // Handler vazio para campos controlados
                  placeholder="UF"
                  readOnly={!!cepData?.uf}
                  required
                />
                {state.fieldErrors?.["endereco.estado"] && (
                  <p className="text-sm text-red-500">{state.fieldErrors["endereco.estado"][0]}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <TorresForm
          torres={torres}
          onChange={handleTorresChange}
          errors={state.fieldErrors}
        />

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" asChild>
            <Link href="/obras">Cancelar</Link>
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Criando..." : "Criar Obra"}
          </Button>
        </div>
      </form>
    </div>
  )
}
