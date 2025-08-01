'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User } from "lucide-react"
import { type IntegranteWithRelations } from '@/services/integrante/integrante.service'
import { type EquipeWithRelations } from '@/services/equipe/equipe.service'
import { useEquipes } from '@/hooks/equipes/use-equipes'

interface IntegranteEditModalProps {
  integrante: IntegranteWithRelations | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function IntegranteEditModal({ integrante, open, onOpenChange }: IntegranteEditModalProps) {
  const [nome, setNome] = useState('')
  const [equipeId, setEquipeId] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const { data: equipes } = useEquipes()

  useEffect(() => {
    if (integrante) {
      setNome(integrante.nome)
      setEquipeId(integrante.equipeId)
    }
  }, [integrante])

  const handleSave = async () => {
    if (!integrante || !nome.trim()) return

    setIsSaving(true)
    try {
      const response = await fetch(`/api/integrantes/${integrante.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: nome.trim(),
          equipeId
        })
      })

      if (response.ok) {
        onOpenChange(false)
        // Recarregar dados
        window.location.reload()
      }
    } catch (error) {
      console.error('Erro ao atualizar integrante:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!integrante) return

    if (!confirm('Tem certeza que deseja excluir este integrante?')) return

    setIsSaving(true)
    try {
      const response = await fetch(`/api/integrantes/${integrante.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        onOpenChange(false)
        // Recarregar dados
        window.location.reload()
      }
    } catch (error) {
      console.error('Erro ao excluir integrante:', error)
    } finally {
      setIsSaving(false)
    }
  }

  if (!integrante) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Editar Integrante
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome</Label>
            <Input
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Nome do integrante"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="equipe">Equipe</Label>
            <Select value={equipeId} onValueChange={setEquipeId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma equipe" />
              </SelectTrigger>
              <SelectContent>
                                 {equipes?.map((equipe) => (
                   <SelectItem key={equipe.id} value={equipe.id}>
                     {equipe.nome} - {equipe.obra.nome} ({equipe.obra.cei})
                   </SelectItem>
                 ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 pt-4">
            <Button 
              onClick={handleSave} 
              disabled={!nome.trim() || isSaving}
              className="flex-1"
            >
              Salvar
            </Button>
            <Button 
              onClick={handleDelete} 
              variant="destructive"
              disabled={isSaving}
            >
              Excluir
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 