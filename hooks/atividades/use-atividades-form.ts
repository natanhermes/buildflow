import { useQuery } from '@tanstack/react-query'

type ObraForSelect = {
  id: string
  nome: string
  cei: string
}

type PavimentoForSelect = {
  id: string
  identificador: string
  areaM2: string
  argamassaM3: string
  torre: {
    id: string
    nome: string
  }
}

export const atividadeFormQueryKeys = {
  obras: ['atividades', 'obras'] as const,
  pavimentos: (obraId: string) => ['atividades', 'pavimentos', obraId] as const,
}

export function useObrasForAtividades() {
  return useQuery<ObraForSelect[]>({
    queryKey: atividadeFormQueryKeys.obras,
    queryFn: async () => {
      const response = await fetch('/api/atividades/obras')
      
      if (!response.ok) {
        throw new Error('Erro ao carregar obras')
      }
      
      return response.json()
    },
    staleTime: 10 * 60 * 1000, // 10 minutos - obras mudam com menos frequência
    gcTime: 30 * 60 * 1000, // 30 minutos no cache
  })
}

export function usePavimentosByObra(obraId: string | null) {
  return useQuery<PavimentoForSelect[]>({
    queryKey: atividadeFormQueryKeys.pavimentos(obraId || ''),
    queryFn: async () => {
      if (!obraId) return []
      
      const response = await fetch(`/api/atividades/pavimentos?obraId=${obraId}`)
      
      if (!response.ok) {
        throw new Error('Erro ao carregar pavimentos')
      }
      
      return response.json()
    },
    enabled: !!obraId, // Só executa se obraId estiver disponível
    staleTime: 5 * 60 * 1000, // 5 minutos - dados de pavimentos são relativamente estáveis
    gcTime: 10 * 60 * 1000, // 10 minutos no cache
  })
}