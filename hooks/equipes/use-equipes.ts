import { useSuspenseQuery } from '@tanstack/react-query'
import { type EquipeWithRelations } from '@/services/equipe/equipe.service'

export const equipeQueryKeys = {
  all: ['equipes'] as const,
  lists: () => [...equipeQueryKeys.all, 'list'] as const,
  list: (obraId?: string) => [...equipeQueryKeys.lists(), obraId] as const,
  details: () => [...equipeQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...equipeQueryKeys.details(), id] as const,
}

export function useEquipes(obraId?: string) {
  return useSuspenseQuery<EquipeWithRelations[]>({
    queryKey: equipeQueryKeys.list(obraId),
    queryFn: (): Promise<EquipeWithRelations[]> => {
      const url = obraId ? `/api/equipes?obraId=${obraId}` : '/api/equipes'
      return fetch(url).then(res => res.json())
    },
  })
}

export function useEquipe(id: string) {
  return useSuspenseQuery<EquipeWithRelations>({
    queryKey: equipeQueryKeys.detail(id),
    queryFn: (): Promise<EquipeWithRelations> =>
      fetch(`/api/equipes/${id}`).then(res => res.json()),
  })
} 