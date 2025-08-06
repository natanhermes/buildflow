"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { useActionState } from 'react'
import { createIntegranteAction, type ActionState } from '@/app/integrantes/actions'
import { withMask } from 'use-mask-input'

export function IntegranteForm() {
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    createIntegranteAction,
    { success: false }
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações do Integrante</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome Completo *</Label>
              <Input
                id="nome"
                name="nome"
                placeholder="Digite o nome completo"
                required
              />
              {state?.fieldErrors?.nome && (
                <p className="text-sm text-red-500">{state.fieldErrors.nome[0]}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cpf">CPF *</Label>
              <Input
                id="cpf"
                name="cpf"
                ref={withMask('999.999.999-99')}
                placeholder="000.000.000-00"
                required
              />
              {state?.fieldErrors?.cpf && (
                <p className="text-sm text-red-500">{state.fieldErrors.cpf[0]}</p>
              )}
            </div>
          </div>

          {state?.error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{state.error}</p>
            </div>
          )}

          <Button type="submit" disabled={isPending} className="w-full">
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Cadastrar Integrante
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}