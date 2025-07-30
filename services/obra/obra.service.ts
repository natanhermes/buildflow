import db from '@/lib/db'
import { Obra, Torre, Pavimento, Prisma } from '@prisma/client'

export type ObraWithRelations = Obra & {
  torres: (Torre & {
    pavimentos: Pavimento[]
  })[]
}

export type CreateObraData = {
  nome: string
  cei: string
  endereco: string
  valorM2: number
  dataInicio: Date
  dataFim: Date
  criadoPorId: string
  torres: {
    nome: string
    pavimentos: {
      identificador: string
      areaM2: number
      argamassaM3: number
      espessuraCM: number
    }[]
  }[]
}

export async function createObra(data: CreateObraData): Promise<ObraWithRelations> {
  const { torres, ...obraData } = data

  // Calcular totais baseados nos pavimentos
  const totalGeral = torres.reduce((total, torre) => 
    total + torre.pavimentos.reduce((torreTotal, pav) => 
      torreTotal + (pav.areaM2 * data.valorM2), 0), 0)

  const obra = await db.obra.create({
    data: {
      ...obraData,
      valorM2: new Prisma.Decimal(data.valorM2),
      totalGeral: new Prisma.Decimal(totalGeral),
      totalExecutado: new Prisma.Decimal(0),
      totalPendente: new Prisma.Decimal(totalGeral),
      torres: {
        create: torres.map(torre => ({
          nome: torre.nome,
          pavimentos: {
            create: torre.pavimentos.map(pavimento => ({
              identificador: pavimento.identificador,
              dataExecucao: new Date(), // Valor inicial
              areaExecutadaM2: new Prisma.Decimal(0),
              areaM2: new Prisma.Decimal(pavimento.areaM2),
              percentualExecutado: new Prisma.Decimal(0),
              argamassaM3: new Prisma.Decimal(pavimento.argamassaM3),
              espessuraCM: new Prisma.Decimal(pavimento.espessuraCM),
            }))
          }
        }))
      }
    },
    include: {
      torres: {
        include: {
          pavimentos: true
        }
      }
    }
  })

  return obra
}

export async function findObraById(id: string): Promise<ObraWithRelations | null> {
  return await db.obra.findUnique({
    where: { id },
    include: {
      torres: {
        include: {
          pavimentos: true
        }
      }
    }
  })
}

export async function findObrasByCriadoPor(criadoPorId: string): Promise<Obra[]> {
  return await db.obra.findMany({
    where: { criadoPorId },
    orderBy: { createdAt: 'desc' }
  })
}

export async function findAllObras(): Promise<ObraWithRelations[]> {
  return await db.obra.findMany({
    include: {
      torres: {
        include: {
          pavimentos: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  })
}

export async function checkCeiExists(cei: string): Promise<boolean> {
  const obra = await db.obra.findUnique({
    where: { cei }
  })
  return !!obra
} 