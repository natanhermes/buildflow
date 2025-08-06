"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Users, Loader2 } from "lucide-react"
import { useIntegrantesForSelect, type Integrante } from "@/hooks/integrantes/use-integrantes"

interface IntegrantesModalProps {
  selectedIntegrantes: string[]
  onSelectionChange: (integranteIds: string[]) => void
}

export function IntegrantesModal({ selectedIntegrantes, onSelectionChange }: IntegrantesModalProps) {
  const [open, setOpen] = useState(false)
  const [tempSelected, setTempSelected] = useState<string[]>(selectedIntegrantes)
  const { data: integrantes, isLoading, error } = useIntegrantesForSelect()

  const handleCheckboxChange = (integranteId: string, checked: boolean) => {
    if (checked) {
      setTempSelected(prev => [...prev, integranteId])
    } else {
      setTempSelected(prev => prev.filter(id => id !== integranteId))
    }
  }

  const handleConfirm = () => {
    onSelectionChange(tempSelected)
    setOpen(false)
  }

  const handleCancel = () => {
    setTempSelected(selectedIntegrantes)
    setOpen(false)
  }

  const getSelectedIntegranteNames = () => {
    if (!integrantes) return []
    return integrantes
      .filter(integrante => selectedIntegrantes.includes(integrante.id))
      .map(integrante => integrante.nome)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          type="button" 
          variant="outline" 
          className="w-full justify-start text-left font-normal"
        >
          <Users className="mr-2 h-4 w-4" />
          {selectedIntegrantes.length > 0 
            ? `${selectedIntegrantes.length} integrante(s) selecionado(s)`
            : "Selecionar integrantes"
          }
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Selecionar Integrantes</DialogTitle>
          <DialogDescription>
            Escolha os integrantes que participarão desta atividade.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {selectedIntegrantes.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Selecionados:</h4>
              <div className="flex flex-wrap gap-2">
                {getSelectedIntegranteNames().map((nome) => (
                  <Badge key={nome} variant="secondary">
                    {nome}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Disponíveis:</h4>
            <ScrollArea className="h-[300px] border rounded-md p-4">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span className="ml-2">Carregando integrantes...</span>
                </div>
              ) : error ? (
                <div className="flex items-center justify-center py-8 text-red-500">
                  Erro ao carregar integrantes
                </div>
              ) : !integrantes || integrantes.length === 0 ? (
                <div className="flex items-center justify-center py-8 text-muted-foreground">
                  Nenhum integrante encontrado
                </div>
              ) : (
                <div className="space-y-3">
                  {integrantes.map((integrante) => (
                    <div key={integrante.id} className="flex items-center space-x-3">
                      <Checkbox
                        id={integrante.id}
                        checked={tempSelected.includes(integrante.id)}
                        onCheckedChange={(checked) => 
                          handleCheckboxChange(integrante.id, checked as boolean)
                        }
                      />
                      <label 
                        htmlFor={integrante.id}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
                      >
                        {integrante.nome} - {integrante.cpf}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button type="button" onClick={handleConfirm}>
            Confirmar ({tempSelected.length})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}