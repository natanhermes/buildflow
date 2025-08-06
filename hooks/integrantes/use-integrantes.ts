import { useQuery } from '@tanstack/react-query'

export const integranteQueryKeys = {
  all: ['integrantes'] as const,
  lists: () => [...integranteQueryKeys.all, 'list'] as const,
  forSelect: () => [...integranteQueryKeys.all, 'for-select'] as const,
}

export type Integrante = {
  id: string
  nome: string
  cpf: string
}

export function useIntegrantes() {
  return useQuery<Integrante[]>({
    queryKey: integranteQueryKeys.lists(),
    queryFn: (): Promise<Integrante[]> =>
      fetch('/api/integrantes').then(res => res.json()),
  })
}

export function useIntegrantesForSelect() {
  return useQuery<Integrante[]>({
    queryKey: integranteQueryKeys.forSelect(),
    queryFn: (): Promise<Integrante[]> =>
      fetch('/api/integrantes?forSelect=true').then(res => res.json()),
  })
}