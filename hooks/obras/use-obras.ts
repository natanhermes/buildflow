import { useSuspenseQuery } from '@tanstack/react-query'
import { type ObraWithRelations } from '@/services/obra/obra.service'
import { type SerializedDecimal } from '@/lib/utils/serialization'

export const obraQueryKeys = {
  all: ['obras'] as const,
  lists: () => [...obraQueryKeys.all, 'list'] as const,
}

// Tipo serializado para uso no cliente
export type SerializedObraWithRelations = SerializedDecimal<ObraWithRelations>

export function useObras() {
  return useSuspenseQuery<SerializedObraWithRelations[]>({
    queryKey: obraQueryKeys.lists(),
    queryFn: (): Promise<SerializedObraWithRelations[]> =>
      fetch('/api/obras').then(res => res.json()),
  })
}
