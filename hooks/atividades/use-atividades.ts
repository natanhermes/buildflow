import { useQuery } from '@tanstack/react-query'
import { type AtividadeWithRelations } from '@/services/atividades/atividade.service'
import { type SerializedDecimal } from '@/lib/utils/serialization'

// Tipo serializado para uso no cliente
export type SerializedAtividadeWithRelations = {
  id: string
  aditivoM3: number | null
  aditivoL: number | null
  saldoAcumuladoM2: number
  execucao: string | null
  inicioExpediente: string | null
  inicioAlmoco: string | null
  fimAlmoco: string | null
  fimExpediente: string | null
  obsExecucao: string | null
  obsPonto: string | null
  obsQtdBetoneira: string | null
  obsHOI: string | null
  usuarioId: string
  obraId: string
  pavimentoId: string
  createdAt: string
  updatedAt: string
  atividadeIntegrantes: {
    integrante: {
      id: string
      nome: string
      cpf: string
      createdAt: string
      updatedAt: string
    }
  }[]
  usuario: {
    id: string
    username: string
    nome: string
    sobrenome: string
    email: string
    role: string
    status: string
    createdAt: string
    updatedAt: string
  }
  obra: {
    id: string
    nome: string
    cei: string
    endereco: string
    valorM2: number
    dataInicio: string
    dataFim: string
    totalGeral: number
    totalExecutado: number
    totalPendente: number
    criadoPorId: string
    createdAt: string
    updatedAt: string
  }
  pavimento: {
    id: string
    identificador: string
    dataExecucao: string | null
    areaExecutadaM2: number | null
    areaM2: number
    percentualExecutado: number | null
    argamassaM3: number
    espessuraCM: number
    obs: string | null
    torreId: string
    createdAt: string
    updatedAt: string
    torre: {
      id: string
      nome: string
    }
  }
}

export const atividadeQueryKeys = {
  all: ['atividades'] as const,
  lists: () => [...atividadeQueryKeys.all, 'list'] as const,
  byIntegrante: (integranteId: string) => [...atividadeQueryKeys.all, 'integrante', integranteId] as const,
}

export function useAtividadesByIntegrante(integranteId: string) {
  return useQuery<SerializedAtividadeWithRelations[]>({
    queryKey: atividadeQueryKeys.byIntegrante(integranteId),
    queryFn: async (): Promise<SerializedAtividadeWithRelations[]> => {
      const response = await fetch(`/api/integrantes/${integranteId}/atividades`)
      
      if (!response.ok) {
        throw new Error('Erro ao carregar atividades')
      }
      
      return response.json()
    },
    enabled: !!integranteId, // Só executa se integranteId estiver disponível
  })
}