"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Trash2 } from "lucide-react"

interface Pavimento {
  id: string
  identificador: string
  areaM2: number
  argamassaM3: number
  espessuraCM: number
}

interface Torre {
  id: string
  nome: string
  pavimentos: Pavimento[]
}

interface TorresFormProps {
  torres: Torre[]
  onChange: (torres: Torre[]) => void
  errors?: Record<string, string[]>
}

export function TorresForm({ torres, onChange, errors }: TorresFormProps) {
  const adicionarTorre = () => {
    const novaTorre: Torre = {
      id: Date.now().toString(),
      nome: `Torre ${torres.length + 1}`,
      pavimentos: [],
    }
    onChange([...torres, novaTorre])
  }

  const removerTorre = (torreId: string) => {
    onChange(torres.filter((torre) => torre.id !== torreId))
  }

  const atualizarTorre = (torreId: string, nome: string) => {
    onChange(torres.map((torre) => (torre.id === torreId ? { ...torre, nome } : torre)))
  }

  const adicionarPavimento = (torreId: string) => {
    onChange(
      torres.map((torre) => {
        if (torre.id === torreId) {
          const novoPavimento: Pavimento = {
            id: Date.now().toString(),
            identificador: `Pavimento ${torre.pavimentos.length + 1}`,
            areaM2: 0,
            argamassaM3: 0,
            espessuraCM: 0,
          }
          return {
            ...torre,
            pavimentos: [...torre.pavimentos, novoPavimento],
          }
        }
        return torre
      }),
    )
  }

  const removerPavimento = (torreId: string, pavimentoId: string) => {
    onChange(
      torres.map((torre) => {
        if (torre.id === torreId) {
          return {
            ...torre,
            pavimentos: torre.pavimentos.filter((pav) => pav.id !== pavimentoId),
          }
        }
        return torre
      }),
    )
  }

  const atualizarPavimento = (torreId: string, pavimentoId: string, field: keyof Pavimento, value: string | number) => {
    onChange(
      torres.map((torre) => {
        if (torre.id === torreId) {
          return {
            ...torre,
            pavimentos: torre.pavimentos.map((pav) => 
              pav.id === pavimentoId ? { ...pav, [field]: value } : pav
            ),
          }
        }
        return torre
      }),
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Torres e Pavimentos</h3>
          <Button type="button" onClick={adicionarTorre} variant="outline" size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Torre
          </Button>
        </div>
        {errors?.torres && (
          <p className="text-sm text-red-500">{errors.torres[0]}</p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {torres.map((torre, torreIndex) => (
          <Card key={torre.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex-1 space-y-2">
                  <Label htmlFor={`torre-${torre.id}`}>Nome da Torre</Label>
                  <Input
                    id={`torre-${torre.id}`}
                    name={`torres.${torreIndex}.nome`}
                    value={torre.nome}
                    onChange={(e) => atualizarTorre(torre.id, e.target.value)}
                    className="max-w-xs"
                  />
                  {errors?.[`torres.${torreIndex}.nome`] && (
                    <p className="text-sm text-red-500">{errors[`torres.${torreIndex}.nome`][0]}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button 
                    type="button" 
                    onClick={() => adicionarPavimento(torre.id)} 
                    variant="outline" 
                    size="sm"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Pavimento
                  </Button>
                  <Button 
                    type="button" 
                    onClick={() => removerTorre(torre.id)} 
                    variant="destructive" 
                    size="sm"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {torre.pavimentos.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Nenhum pavimento adicionado. Clique em "Pavimento" para adicionar.
                  </p>
                )}
                {torre.pavimentos.map((pavimento, pavIndex) => (
                  <div key={pavimento.id} className="grid grid-cols-5 gap-2 p-2 border rounded">
                    <div className="space-y-1">
                      <Label htmlFor={`pav-id-${pavimento.id}`} className="text-xs">
                        Identificador
                      </Label>
                      <Input
                        id={`pav-id-${pavimento.id}`}
                        name={`torres.${torreIndex}.pavimentos.${pavIndex}.identificador`}
                        value={pavimento.identificador}
                        onChange={(e) => atualizarPavimento(torre.id, pavimento.id, "identificador", e.target.value)}
                        placeholder="Ex: 1º Andar"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor={`pav-area-${pavimento.id}`} className="text-xs">
                        Área (m²)
                      </Label>
                      <Input
                        id={`pav-area-${pavimento.id}`}
                        name={`torres.${torreIndex}.pavimentos.${pavIndex}.areaM2`}
                        type="number"
                        value={pavimento.areaM2}
                        onChange={(e) => atualizarPavimento(torre.id, pavimento.id, "areaM2", Number(e.target.value) || 0)}
                        placeholder="0"
                        step="0.01"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor={`pav-argamassa-${pavimento.id}`} className="text-xs">
                        Argamassa (m³)
                      </Label>
                      <Input
                        id={`pav-argamassa-${pavimento.id}`}
                        name={`torres.${torreIndex}.pavimentos.${pavIndex}.argamassaM3`}
                        type="number"
                        value={pavimento.argamassaM3}
                        onChange={(e) => atualizarPavimento(torre.id, pavimento.id, "argamassaM3", Number(e.target.value) || 0)}
                        placeholder="0"
                        step="0.01"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor={`pav-espessura-${pavimento.id}`} className="text-xs">
                        Espessura (cm)
                      </Label>
                      <Input
                        id={`pav-espessura-${pavimento.id}`}
                        name={`torres.${torreIndex}.pavimentos.${pavIndex}.espessuraCM`}
                        type="number"
                        value={pavimento.espessuraCM}
                        onChange={(e) => atualizarPavimento(torre.id, pavimento.id, "espessuraCM", Number(e.target.value) || 0)}
                        placeholder="0"
                        step="0.1"
                      />
                    </div>
                    <div className="flex items-end">
                      <Button
                        type="button"
                        onClick={() => removerPavimento(torre.id, pavimento.id)}
                        variant="destructive"
                        size="sm"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {errors?.[`torres.${torreIndex}.pavimentos`] && (
                  <p className="text-sm text-red-500">{errors[`torres.${torreIndex}.pavimentos`][0]}</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  )
} 