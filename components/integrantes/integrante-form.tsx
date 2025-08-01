'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User } from "lucide-react"
import { useEquipes } from '@/hooks/equipes/use-equipes'
import { createIntegranteAction } from '@/app/integrantes/actions'

export function IntegranteForm() {
  const router = useRouter()
  const { data: equipes } = useEquipes()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string[]>>({})

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true)
    setErrors({})

    try {
      const result = await createIntegranteAction({}, formData)
      
      if (result.error) {
        // Tratar erro geral
        console.error(result.error)
        return
      }

      if (result.fieldErrors) {
        setErrors(result.fieldErrors)
        return
      }

      if (result.success) {
        router.push('/integrantes')
      }
    } catch (error) {
      console.error('Erro ao criar integrante:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Informações do Integrante
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome do Integrante</Label>
            <Input
              id="nome"
              name="nome"
              placeholder="Nome completo do integrante"
              required
            />
            {errors.nome && (
              <p className="text-sm text-destructive">{errors.nome[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="equipeId">Equipe</Label>
            <Select name="equipeId" required>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma equipe" />
              </SelectTrigger>
              <SelectContent>
                                 {equipes?.map((equipe) => (
                   <SelectItem key={equipe.id} value={equipe.id}>
                     {equipe.nome} - {equipe.obra.nome} (CEI: {equipe.obra.cei})
                   </SelectItem>
                 ))}
              </SelectContent>
            </Select>
            {errors.equipeId && (
              <p className="text-sm text-destructive">{errors.equipeId[0]}</p>
            )}
          </div>

          <div className="flex gap-2 pt-4">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? 'Criando...' : 'Criar Integrante'}
            </Button>
            <Button 
              type="button" 
              variant="outline"
              onClick={() => router.push('/integrantes')}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
} 