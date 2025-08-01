'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Users, Building2, Plus, User, X } from "lucide-react"
import { type EquipeWithRelations } from '@/services/equipe/equipe.service'
import { type IntegranteWithRelations } from '@/services/integrante/integrante.service'
import { useIntegrantes } from '@/hooks/integrantes/use-integrantes'

interface EquipeDetailsModalProps {
  equipe: EquipeWithRelations | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EquipeDetailsModal({ equipe, open, onOpenChange }: EquipeDetailsModalProps) {
  const [newIntegranteName, setNewIntegranteName] = useState('')
  const [isAddingIntegrante, setIsAddingIntegrante] = useState(false)
  const { data: allIntegrantes } = useIntegrantes()

  if (!equipe) return null

  const handleAddIntegrante = async () => {
    if (!newIntegranteName.trim()) return

    setIsAddingIntegrante(true)
    try {
      const response = await fetch('/api/integrantes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: newIntegranteName,
          equipeId: equipe.id
        })
      })

      if (response.ok) {
        setNewIntegranteName('')
        // Recarregar dados
        window.location.reload()
      }
    } catch (error) {
      console.error('Erro ao adicionar integrante:', error)
    } finally {
      setIsAddingIntegrante(false)
    }
  }

  const handleRemoveIntegrante = async (integranteId: string, integranteNome: string) => {
    if (!confirm(`Tem certeza que deseja remover ${integranteNome} da equipe?`)) {
      return
    }

    try {
      const response = await fetch(`/api/integrantes/${integranteId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        // Recarregar dados
        window.location.reload()
      }
    } catch (error) {
      console.error('Erro ao remover integrante:', error)
    }
  }

  const handleMoveIntegrante = async (integranteId: string, integranteNome: string, novaEquipeId: string, novaEquipeNome: string) => {
    if (!confirm(`Tem certeza que deseja mover ${integranteNome} para a equipe ${novaEquipeNome}?`)) {
      return
    }

    try {
      const response = await fetch(`/api/integrantes/${integranteId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ equipeId: novaEquipeId })
      })

      if (response.ok) {
        // Recarregar dados
        window.location.reload()
      }
    } catch (error) {
      console.error('Erro ao mover integrante:', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Detalhes da Equipe
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações da Equipe */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">{equipe.nome}</h3>
              <Badge variant="secondary">
                {equipe.integrantes.length} integrantes
              </Badge>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Building2 className="h-4 w-4" />
              <span>Obra: {equipe.obra.nome}</span>
            </div>
          </div>

          <Separator />

          {/* Adicionar Novo Integrante */}
          <div className="space-y-4">
            <h4 className="font-medium">Adicionar Integrante</h4>
            <div className="flex gap-2">
              <div className="flex-1">
                <Label htmlFor="new-integrante" className="sr-only">
                  Nome do integrante
                </Label>
                <Input
                  id="new-integrante"
                  placeholder="Nome do integrante"
                  value={newIntegranteName}
                  onChange={(e) => setNewIntegranteName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddIntegrante()}
                />
              </div>
              <Button 
                onClick={handleAddIntegrante} 
                disabled={!newIntegranteName.trim() || isAddingIntegrante}
              >
                <Plus className="mr-2 h-4 w-4" />
                Adicionar
              </Button>
            </div>
          </div>

          <Separator />

          {/* Lista de Integrantes */}
          <div className="space-y-4">
            <h4 className="font-medium">Integrantes da Equipe</h4>
            
            {equipe.integrantes.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Nenhum integrante nesta equipe.
              </p>
            ) : (
              <div className="space-y-2">
                {equipe.integrantes.map((integrante) => (
                  <div 
                    key={integrante.id} 
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{integrante.nome}</span>
                    </div>
                                         <Button
                       variant="ghost"
                       size="sm"
                       onClick={() => handleRemoveIntegrante(integrante.id, integrante.nome)}
                     >
                       <X className="h-4 w-4" />
                     </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Integrantes Disponíveis para Mover */}
          {allIntegrantes && allIntegrantes.length > 0 && (
            <>
              <Separator />
              <div className="space-y-4">
                <h4 className="font-medium">Integrantes Disponíveis</h4>
                <div className="space-y-2">
                  {allIntegrantes
                    .filter(i => i.equipeId !== equipe.id)
                    .map((integrante) => (
                      <div 
                        key={integrante.id} 
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                                                 <div className="flex items-center gap-2">
                           <User className="h-4 w-4 text-muted-foreground" />
                           <span className="font-medium">{integrante.nome}</span>
                           <Badge variant="outline" className="text-xs">
                             {integrante.equipe.nome}
                           </Badge>
                           <span className="text-xs text-muted-foreground">
                             ({integrante.equipe.obra.nome})
                           </span>
                         </div>
                                                 <Button
                           variant="outline"
                           size="sm"
                           onClick={() => handleMoveIntegrante(integrante.id, integrante.nome, equipe.id, equipe.nome)}
                         >
                           <Plus className="mr-2 h-4 w-4" />
                           Adicionar
                         </Button>
                      </div>
                    ))}
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
} 