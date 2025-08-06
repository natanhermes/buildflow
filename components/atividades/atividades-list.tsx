'use client'

import { Suspense, useState } from 'react'
import { useAtividades, type SerializedAtividadeWithRelations } from '@/hooks/atividades/use-atividades'
import { AtividadeModal } from './atividade-modal'
import { EmptyState } from './empty-state'
import { LoadingState } from './loading-state'
import { ErrorState } from './error-state'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export function AtividadesList() {
  const { data: atividades, isLoading, error, refetch } = useAtividades()
  const [selectedAtividade, setSelectedAtividade] = useState<SerializedAtividadeWithRelations | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleViewDetails = (atividade: SerializedAtividadeWithRelations) => {
    setSelectedAtividade(atividade)
    setIsModalOpen(true)
  }

  const getStatusVariant = (execucao: string | null) => {
    if (!execucao) return 'secondary'
    
    const status = execucao.toLowerCase()
    if (status.includes('concluído') || status.includes('concluida')) return 'default'
    if (status.includes('andamento') || status.includes('executando')) return 'outline'
    if (status.includes('pendente') || status.includes('aguardando')) return 'secondary'
    return 'secondary'
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-'
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR })
    } catch {
      return '-'
    }
  }

  const handleCloseModal = (open: boolean) => {
    setIsModalOpen(open)
    if (!open) {
      setSelectedAtividade(null)
    }
  }

  if (error) {
    return (
      <ErrorState
        message="Erro ao carregar atividades"
        onRetry={() => refetch()}
      />
    )
  }

  if (!atividades || atividades.length === 0) {
    return <EmptyState />
  }

  return (
    <>
      <Suspense fallback={<LoadingState />}>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {atividades.length} atividade(s) encontrada(s)
            </p>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Obra</TableHead>
                  <TableHead>Torre</TableHead>
                  <TableHead>Pavimento</TableHead>
                  <TableHead>Data Execução</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {atividades.map((atividade) => (
                  <TableRow
                    key={atividade.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleViewDetails(atividade)}
                  >
                    <TableCell className="font-medium">
                      {atividade.obra.nome}
                    </TableCell>
                    <TableCell>
                      {atividade.pavimento.torre.nome}
                    </TableCell>
                    <TableCell>
                      {atividade.pavimento.identificador}
                    </TableCell>
                    <TableCell>
                      {formatDate(atividade.pavimento.dataExecucao)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(atividade.execucao)}>
                        {atividade.execucao || 'Não informado'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </Suspense>

      <AtividadeModal
        atividade={selectedAtividade}
        open={isModalOpen}
        onOpenChange={handleCloseModal}
      />
    </>
  )
}