'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users } from "lucide-react"
import { useObras } from '@/hooks/obras/use-obras'
import { createEquipeAction } from '@/app/equipes/actions'

export function EquipeForm() {
  const router = useRouter()
  const { data: obras } = useObras()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string[]>>({})

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true)
    setErrors({})

    try {
      const result = await createEquipeAction({}, formData)
      
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
        router.push('/equipes')
      }
    } catch (error) {
      console.error('Erro ao criar equipe:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Informações da Equipe
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome da Equipe</Label>
            <Input
              id="nome"
              name="nome"
              placeholder="Ex: Equipe A, Equipe de Acabamento"
              required
            />
            {errors.nome && (
              <p className="text-sm text-destructive">{errors.nome[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="obraId">Obra</Label>
            <Select name="obraId" required>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma obra" />
              </SelectTrigger>
              <SelectContent>
                                 {obras?.map((obra) => (
                   <SelectItem key={obra.id} value={obra.id}>
                     {obra.nome} - CEI: {obra.cei}
                   </SelectItem>
                 ))}
              </SelectContent>
            </Select>
            {errors.obraId && (
              <p className="text-sm text-destructive">{errors.obraId[0]}</p>
            )}
          </div>

          <div className="flex gap-2 pt-4">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? 'Criando...' : 'Criar Equipe'}
            </Button>
            <Button 
              type="button" 
              variant="outline"
              onClick={() => router.push('/equipes')}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
} 