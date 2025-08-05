import db from '@/lib/db'
import { Atividade, Integrante, Obra, Pavimento, Usuario, Execucao, Prisma } from '@prisma/client'

export type AtividadeWithRelations = Atividade & {
  atividadeIntegrantes: {
    integrante: Integrante
  }[]
  usuario: Usuario
  obra: Obra
  pavimento: Pavimento & {
    torre: {
      id: string
      nome: string
    }
  }
}

// Constante para padronizar includes
const ATIVIDADE_INCLUDE = {
  atividadeIntegrantes: {
    include: {
      integrante: true
    }
  },
  usuario: true,
  obra: true,
  pavimento: {
    include: {
      torre: {
        select: {
          id: true,
          nome: true,
        }
      }
    }
  }
} as const

export type CreateAtividadeData = {
  aditivoM3?: number
  aditivoL?: number
  execucao?: Execucao
  inicioExpediente?: Date
  inicioAlmoco?: Date
  fimAlmoco?: Date
  fimExpediente?: Date
  obsExecucao?: string
  obsPonto?: string
  obsQtdBetoneira?: string
  obsHOI?: string
  integranteIds: string[]
  usuarioId: string
  obraId: string
  pavimentoId: string
}

export async function createAtividade(data: CreateAtividadeData): Promise<AtividadeWithRelations> {
  // Verificar se integrantes, obra e pavimento existem
  const [integrantes, obra, pavimento] = await Promise.all([
    db.integrante.findMany({ where: { id: { in: data.integranteIds } } }),
    db.obra.findUnique({ where: { id: data.obraId } }),
    db.pavimento.findUnique({
      where: { id: data.pavimentoId },
      include: { torre: true }
    })
  ])

  if (integrantes.length !== data.integranteIds.length) {
    throw new Error('Um ou mais integrantes não foram encontrados')
  }
  if (!obra) {
    throw new Error('Obra não encontrada')
  }
  if (!pavimento) {
    throw new Error('Pavimento não encontrado')
  }

  // Calcular o saldo acumulado
  const saldoAcumulado = await calculateSaldoAcumulado(data.pavimentoId, pavimento.areaM2)

  const { integranteIds, ...atividadeData } = data

  const atividade = await db.atividade.create({
    data: {
      ...atividadeData,
      aditivoM3: data.aditivoM3 ? new Prisma.Decimal(data.aditivoM3) : null,
      aditivoL: data.aditivoL ? new Prisma.Decimal(data.aditivoL) : null,
      saldoAcumuladoM2: new Prisma.Decimal(saldoAcumulado),
      atividadeIntegrantes: {
        create: data.integranteIds.map(integranteId => ({
          integranteId
        }))
      }
    },
    include: ATIVIDADE_INCLUDE
  })

  return atividade
}

export async function findAtividadeById(id: string): Promise<AtividadeWithRelations | null> {
  return await db.atividade.findUnique({
    where: { id },
    include: ATIVIDADE_INCLUDE
  })
}

export async function findAllAtividades(): Promise<AtividadeWithRelations[]> {
  return await db.atividade.findMany({
    include: ATIVIDADE_INCLUDE,
    orderBy: { createdAt: 'desc' }
  })
}

export async function findAtividadesByObra(obraId: string): Promise<AtividadeWithRelations[]> {
  return await db.atividade.findMany({
    where: { obraId },
    include: ATIVIDADE_INCLUDE,
    orderBy: { createdAt: 'desc' }
  })
}

export async function findAtividadesByPavimento(pavimentoId: string): Promise<AtividadeWithRelations[]> {
  return await db.atividade.findMany({
    where: { pavimentoId },
    include: ATIVIDADE_INCLUDE,
    orderBy: { createdAt: 'desc' }
  })
}

export async function findAtividadesByIntegrante(integranteId: string): Promise<AtividadeWithRelations[]> {
  return await db.atividade.findMany({
    where: {
      atividadeIntegrantes: {
        some: {
          integranteId: integranteId
        }
      }
    },
    include: ATIVIDADE_INCLUDE,
    orderBy: { createdAt: 'desc' }
  })
}

export async function updateAtividade(id: string, data: Partial<CreateAtividadeData>): Promise<AtividadeWithRelations> {
  // Se o pavimento mudou, recalcular o saldo acumulado
  let saldoAcumulado: number | undefined

  if (data.pavimentoId) {
    const pavimento = await db.pavimento.findUnique({
      where: { id: data.pavimentoId }
    })

    if (!pavimento) {
      throw new Error('Pavimento não encontrado')
    }

    saldoAcumulado = await calculateSaldoAcumulado(data.pavimentoId, pavimento.areaM2)
  }

  const { integranteIds, ...updateData } = data

  return await db.atividade.update({
    where: { id },
    data: {
      ...updateData,
      aditivoM3: data.aditivoM3 ? new Prisma.Decimal(data.aditivoM3) : undefined,
      aditivoL: data.aditivoL ? new Prisma.Decimal(data.aditivoL) : undefined,
      saldoAcumuladoM2: saldoAcumulado ? new Prisma.Decimal(saldoAcumulado) : undefined,
      ...(integranteIds && {
        atividadeIntegrantes: {
          deleteMany: {},
          create: integranteIds.map(integranteId => ({
            integranteId
          }))
        }
      })
    },
    include: ATIVIDADE_INCLUDE
  })
}

export async function deleteAtividade(id: string): Promise<void> {
  await db.atividade.delete({
    where: { id }
  })
}

// Função para calcular o saldo acumulado
async function calculateSaldoAcumulado(pavimentoId: string, areaM2Pavimento: Prisma.Decimal): Promise<number> {
  // Buscar a última atividade do pavimento
  const ultimaAtividade = await db.atividade.findFirst({
    where: { pavimentoId },
    orderBy: { createdAt: 'desc' }
  })

  // Se não há atividades anteriores, o saldo é apenas a área do pavimento
  if (!ultimaAtividade) {
    return Number(areaM2Pavimento)
  }

  // Se há atividades anteriores, somar a área do pavimento ao último saldo acumulado
  const ultimoSaldo = ultimaAtividade.saldoAcumuladoM2 || new Prisma.Decimal(0)
  return Number(areaM2Pavimento) + Number(ultimoSaldo)
}

// Função para obter dados para select de obras
export async function findObrasForSelect(): Promise<{ id: string; nome: string; cei: string }[]> {
  return await db.obra.findMany({
    select: {
      id: true,
      nome: true,
      cei: true,
    },
    orderBy: { nome: 'asc' }
  })
}

// Função para obter pavimentos de uma obra
export async function findPavimentosByObra(obraId: string): Promise<{
  id: string
  identificador: string
  areaM2: string
  torre: { id: string; nome: string }
}[]> {
  const pavimentos = await db.pavimento.findMany({
    where: {
      torre: {
        obraId: obraId
      }
    },
    select: {
      id: true,
      identificador: true,
      areaM2: true,
      torre: {
        select: {
          id: true,
          nome: true,
        }
      }
    },
    orderBy: [
      { torre: { nome: 'asc' } },
      { identificador: 'asc' }
    ]
  })

  return pavimentos.map(p => ({
    ...p,
    areaM2: p.areaM2.toString()
  }))
}