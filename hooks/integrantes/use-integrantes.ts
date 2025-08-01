import { useSuspenseQuery } from '@tanstack/react-query'
import { type IntegranteWithRelations } from '@/services/integrante/integrante.service'

export const integranteQueryKeys = {
  all: ['integrantes'] as const,
  lists: () => [...integranteQueryKeys.all, 'list'] as const,
  list: (equipeId?: string) => [...integranteQueryKeys.lists(), equipeId] as const,
}

export function useIntegrantes(equipeId?: string) {
  return useSuspenseQuery<IntegranteWithRelations[]>({
    queryKey: integranteQueryKeys.list(equipeId),
    queryFn: (): Promise<IntegranteWithRelations[]> => {
      const url = equipeId ? `/api/integrantes?equipeId=${equipeId}` : '/api/integrantes'
      return fetch(url).then(res => res.json())
    },
  })
}

export function useIntegrante(id: string) {
  return useSuspenseQuery<IntegranteWithRelations>({
    queryKey: integranteQueryKeys.detail(id),
    queryFn: (): Promise<IntegranteWithRelations> =>
      fetch(`/api/integrantes/${id}`).then(res => res.json()),
  })
} 