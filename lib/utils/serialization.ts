import { Prisma } from '@prisma/client'

/**
 * Serializa objetos Decimal do Prisma para números JavaScript
 * que podem ser enviados para Client Components
 */
export function serializeDecimal(value: Prisma.Decimal | null): number | null {
  if (value === null) return null
  return Number(value)
}

/**
 * Serializa recursivamente um objeto convertendo Decimals para números
 */
export function serializeObject<T>(obj: T): T {
  if (obj === null || obj === undefined) {
    return obj
  }

  if (obj instanceof Prisma.Decimal) {
    return Number(obj) as T
  }

  if (obj instanceof Date) {
    return obj
  }

  if (Array.isArray(obj)) {
    return obj.map(item => serializeObject(item)) as T
  }

  if (typeof obj === 'object' && obj !== null) {
    const serialized = {} as T
    for (const [key, value] of Object.entries(obj)) {
      ;(serialized as any)[key] = serializeObject(value)
    }
    return serialized
  }

  return obj
}

/**
 * Tipo helper para converter Decimals em números e Dates em strings (como depois do JSON.stringify/parse)
 */
export type SerializedDecimal<T> = T extends Prisma.Decimal
  ? number
  : T extends Prisma.Decimal | null
  ? number | null
  : T extends Date | null
  ? string | null
  : T extends Date
  ? string
  : T extends Array<infer U>
  ? Array<SerializedDecimal<U>>
  : T extends object
  ? { [K in keyof T]: SerializedDecimal<T[K]> }
  : T