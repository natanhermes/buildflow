import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { IntegranteCard } from './integrante-card'
import { EmptyState } from './empty-state'
import { ErrorState } from './error-state'
import { useState } from 'react'
import { Search } from 'lucide-react'
import { findAllIntegrantes } from '@/services/integrante/integrante.service'

export async function IntegrantesList() {
  try {
    const integrantes = await findAllIntegrantes()
    
    if (integrantes.length === 0) {
      return <EmptyState />
    }

    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Lista de Integrantes</CardTitle>
            </div>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome do integrante ou CPF..."
                className="pl-8"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {integrantes.map((integrante) => (
                <IntegranteCard key={integrante.id} integrante={integrante} />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  } catch (error) {
    console.error('Erro ao carregar integrantes:', error)
    return <ErrorState />
  }
}