"use client"

import type React from "react"

import { useActionState, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { createObraAction, type ActionState } from "../actions"
import { TorresForm } from "./torres-form"

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
  espessuraCM: number
}

export default function NovaObraPage() {
  const [torres, setTorres] = useState<Torre[]>([])
  const [state, formAction, isPending] = useActionState(createObraAction, {})

  const handleTorresChange = (novasTorres: Torre[]) => {
    setTorres(novasTorres)
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
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
                  placeholder="00.000.000/0000-00"
                  required
                />
                {state.fieldErrors?.cei && (
                  <p className="text-sm text-red-500">{state.fieldErrors.cei[0]}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="endereco">Endereço</Label>
              <Textarea
                id="endereco"
                name="endereco"
                placeholder="Digite o endereço completo"
                required
              />
              {state.fieldErrors?.endereco && (
                <p className="text-sm text-red-500">{state.fieldErrors.endereco[0]}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
