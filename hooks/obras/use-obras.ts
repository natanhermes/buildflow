import { useSuspenseQuery } from '@tanstack/react-query'

export const obraQueryKeys = {
  all: ['obras'] as const,
  lists: () => [...obraQueryKeys.all, 'list'] as const,
}

import { type ObraWithRelations } from '@/services/obra/obra.service'

export function useObras() {
  return useSuspenseQuery<ObraWithRelations[]>({
    queryKey: obraQueryKeys.lists(),
    queryFn: (): Promise<ObraWithRelations[]> =>
      fetch('/api/obras').then(res => res.json()),
  })
}
