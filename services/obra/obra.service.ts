import db from '@/lib/db'
import { Obra, Torre, Pavimento, Prisma } from '@prisma/client'

export type ObraWithRelations = Obra & {
  endereco?: {
    id: string
    logradouro: string
    numero: string
    complemento?: string | null
    bairro: string
    cidade: string
    estado: string
  }
  torres: (Torre & {
    pavimentos: Pavimento[]
  })[]
}

export type CreateObraData = {
  nome: string
  cei: string
  construtora: string
  endereco: {
    cep: string
    logradouro: string
    numero: string
    complemento?: string
    bairro: string
    cidade: string
    estado: string
  }
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
    }[]
  }[]
}

export async function createObra(data: CreateObraData): Promise<ObraWithRelations> {
  const { torres, endereco, ...obraData } = data

  const totalGeral = torres.reduce(
    (total, torre) =>
      total +
      torre.pavimentos.reduce((torreTotal, pav) => torreTotal + pav.areaM2, 0),
    0
  )

  const enderecoCreated = await db.endereco.create({
    data: {
      logradouro: endereco.logradouro,
      numero: endereco.numero,
      complemento: endereco.complemento,
      bairro: endereco.bairro,
      cidade: endereco.cidade,
      estado: endereco.estado,
    }
  })

  const obra = await db.obra.create({
    data: {
      nome: obraData.nome,
      cei: obraData.cei,
      construtora: obraData.construtora,
      valorM2: new Prisma.Decimal(data.valorM2),
      dataInicio: obraData.dataInicio,
      dataFim: obraData.dataFim,
      criadoPorId: obraData.criadoPorId,
      totalGeral: new Prisma.Decimal(totalGeral),
      enderecoId: enderecoCreated.id,
      torres: {
        create: torres.map(torre => ({
          nome: torre.nome,
          pavimentos: {
            create: torre.pavimentos.map(pavimento => ({
              identificador: pavimento.identificador,
              areaM2: new Prisma.Decimal(pavimento.areaM2),
              argamassaM3: new Prisma.Decimal(pavimento.argamassaM3),
            }))
          }
        }))
      }
    },
    include: {
      endereco: true,
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
      endereco: true,
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
      endereco: true,
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