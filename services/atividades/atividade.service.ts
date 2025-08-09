import db from '@/lib/db'
import { Atividade, Integrante, Obra, Pavimento, Usuario, Execucao, Prisma, StatusAtividade } from '@prisma/client'

export type AtividadeWithRelations = Omit<Atividade, 'aditivoM3' | 'aditivoL' | 'saldoAcumuladoM2'> & {
  aditivoM3: number | null
  aditivoL: number | null
  saldoAcumuladoM2: number | null
  atividadeIntegrantes: {
    integrante: Integrante
  }[]
  usuario: Usuario
  obra: Omit<Obra, 'valorM2' | 'totalGeral' | 'totalExecutado' | 'totalPendente'> & {
    valorM2: number
    totalGeral: number
    totalExecutado: number | null
    totalPendente: number | null
  }
  pavimento: Omit<Pavimento, 'areaM2' | 'areaExecutadaM2' | 'percentualExecutado' | 'argamassaM3' | 'espessuraCM'> & {
    areaM2: number
    areaExecutadaM2: number | null
    percentualExecutado: number | null
    argamassaM3: number
    espessuraCM: number | null
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
  status?: StatusAtividade
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
  // Campos do pavimento
  dataExecucao: Date
  areaExecutadaM2?: number
  areaPreparadaM2?: number
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

  const status: StatusAtividade = data.status ?? 'EXECUCAO'

  // Calcular o saldo acumulado (para métrica histórica)
  const saldoAcumulado = await calculateSaldoAcumulado(data.pavimentoId, pavimento.areaM2)

  // Preparar payload base
  const {
    integranteIds,
    dataExecucao,
    areaExecutadaM2,
    areaPreparadaM2,
    usuarioId,
    obraId,
    pavimentoId,
    ...atividadeData
  } = data

  const atividadeCreateData: Prisma.AtividadeCreateInput = {
    ...atividadeData,
    status,
    aditivoM3: data.aditivoM3 ? new Prisma.Decimal(data.aditivoM3) : null,
    aditivoL: data.aditivoL ? new Prisma.Decimal(data.aditivoL) : null,
    saldoAcumuladoM2: new Prisma.Decimal(saldoAcumulado),
    usuario: { connect: { id: usuarioId } },
    obra: { connect: { id: obraId } },
    pavimento: { connect: { id: pavimentoId } },
    atividadeIntegrantes: {
      create: data.integranteIds.map(integranteId => ({
        integrante: { connect: { id: integranteId } },
      }))
    }
  }

  const pavimentoUpdateData: Prisma.PavimentoUpdateInput = {
    dataExecucao: data.dataExecucao,
  }

  // Branch por status
  if (status === 'EXECUCAO') {
    if (!areaExecutadaM2 || areaExecutadaM2 <= 0) {
      throw new Error('Área executada deve ser maior que zero')
    }
    const percentualExecutado = (areaExecutadaM2 / Number(pavimento.areaM2)) * 100
    const espessuraCM = (Number(pavimento.argamassaM3) / areaExecutadaM2) * 100
    pavimentoUpdateData.areaExecutadaM2 = new Prisma.Decimal(areaExecutadaM2)
    pavimentoUpdateData.percentualExecutado = new Prisma.Decimal(percentualExecutado)
    pavimentoUpdateData.espessuraCM = new Prisma.Decimal(espessuraCM)

    // Distribuir produção pelos integrantes
    const producaoIndividual = areaExecutadaM2 / data.integranteIds.length
    atividadeCreateData.atividadeIntegrantes = {
      create: data.integranteIds.map(integranteId => ({
        integrante: { connect: { id: integranteId } },
        producaoM2: new Prisma.Decimal(producaoIndividual)
      }))
    }
  } else if (status === 'PREPARACAO_1' || status === 'PREPARACAO_2' || status === 'PREPARACAO_3') {
    if (!areaPreparadaM2 || areaPreparadaM2 <= 0) {
      throw new Error('Área preparada deve ser maior que zero')
    }
    atividadeCreateData.areaPreparadaM2 = new Prisma.Decimal(areaPreparadaM2)

    const acumuladoAtual = Number(pavimento.areaPreparadaAcumuladaM2 ?? 0)
    const novaSoma = acumuladoAtual + areaPreparadaM2
    const limite = Number(pavimento.areaM2)
    const novoAcumulado = Math.min(novaSoma, limite)
    const percentualPreparacao = (novoAcumulado / limite) * 100

    pavimentoUpdateData.areaPreparadaAcumuladaM2 = new Prisma.Decimal(novoAcumulado)
    pavimentoUpdateData.percentualPreparacao = new Prisma.Decimal(percentualPreparacao)
    pavimentoUpdateData.preparacaoPendente = novoAcumulado < limite
  } else {
    // MANUTENCAO ou SEM_ATIVIDADE: apenas dataExecucao (já setada)
  }

  // Usar transação otimizada para criar atividade e atualizar pavimento
  let result
  try {
    result = await db.$transaction(async (tx) => {
      const atividade = await tx.atividade.create({
        data: atividadeCreateData,
        include: ATIVIDADE_INCLUDE
      })
      await tx.pavimento.update({ where: { id: pavimentoId }, data: pavimentoUpdateData })
      return atividade
    }, {
      timeout: 15000, // 15 segundos de timeout
    })
  } catch (error: any) {
    // Tratamento específico para timeout de transação
    if (error.code === 'P2028') {
      throw new Error('Operação demorou mais que o esperado. Tente novamente.')
    }
    // Re-lançar outros erros
    throw error
  }

  const atividade = result

  // Converter Decimal para number para compatibilidade com componentes cliente
  return {
    ...atividade,
    aditivoM3: atividade.aditivoM3 ? Number(atividade.aditivoM3) : null,
    aditivoL: atividade.aditivoL ? Number(atividade.aditivoL) : null,
    saldoAcumuladoM2: atividade.saldoAcumuladoM2 ? Number(atividade.saldoAcumuladoM2) : null,
    obra: {
      ...atividade.obra,
      valorM2: Number(atividade.obra.valorM2),
      totalGeral: Number(atividade.obra.totalGeral),
      totalExecutado: atividade.obra.totalExecutado ? Number(atividade.obra.totalExecutado) : null,
      totalPendente: atividade.obra.totalPendente ? Number(atividade.obra.totalPendente) : null,
    },
    pavimento: {
      ...atividade.pavimento,
      areaM2: Number(atividade.pavimento.areaM2),
      areaExecutadaM2: atividade.pavimento.areaExecutadaM2 ? Number(atividade.pavimento.areaExecutadaM2) : null,
      percentualExecutado: atividade.pavimento.percentualExecutado ? Number(atividade.pavimento.percentualExecutado) : null,
      argamassaM3: Number(atividade.pavimento.argamassaM3),
      espessuraCM: atividade.pavimento.espessuraCM ? Number(atividade.pavimento.espessuraCM) : null,
    }
  }
}

export async function findAtividadeById(id: string): Promise<AtividadeWithRelations | null> {
  const atividade = await db.atividade.findUnique({
    where: { id },
    include: ATIVIDADE_INCLUDE
  })

  if (!atividade) return null

  // Converter Decimal para number para compatibilidade com componentes cliente
  return {
    ...atividade,
    aditivoM3: atividade.aditivoM3 ? Number(atividade.aditivoM3) : null,
    aditivoL: atividade.aditivoL ? Number(atividade.aditivoL) : null,
    saldoAcumuladoM2: atividade.saldoAcumuladoM2 ? Number(atividade.saldoAcumuladoM2) : null,
    obra: {
      ...atividade.obra,
      valorM2: Number(atividade.obra.valorM2),
      totalGeral: Number(atividade.obra.totalGeral),
      totalExecutado: atividade.obra.totalExecutado ? Number(atividade.obra.totalExecutado) : null,
      totalPendente: atividade.obra.totalPendente ? Number(atividade.obra.totalPendente) : null,
    },
    pavimento: {
      ...atividade.pavimento,
      areaM2: Number(atividade.pavimento.areaM2),
      areaExecutadaM2: atividade.pavimento.areaExecutadaM2 ? Number(atividade.pavimento.areaExecutadaM2) : null,
      percentualExecutado: atividade.pavimento.percentualExecutado ? Number(atividade.pavimento.percentualExecutado) : null,
      argamassaM3: Number(atividade.pavimento.argamassaM3),
      espessuraCM: atividade.pavimento.espessuraCM ? Number(atividade.pavimento.espessuraCM) : null,
    }
  }
}

export async function findAllAtividades(): Promise<AtividadeWithRelations[]> {
  const atividades = await db.atividade.findMany({
    include: ATIVIDADE_INCLUDE,
    orderBy: { createdAt: 'desc' }
  })

  // Converter Decimal para number para compatibilidade com componentes cliente
  return atividades.map(atividade => ({
    ...atividade,
    aditivoM3: atividade.aditivoM3 ? Number(atividade.aditivoM3) : null,
    aditivoL: atividade.aditivoL ? Number(atividade.aditivoL) : null,
    saldoAcumuladoM2: atividade.saldoAcumuladoM2 ? Number(atividade.saldoAcumuladoM2) : null,
    obra: {
      ...atividade.obra,
      valorM2: Number(atividade.obra.valorM2),
      totalGeral: Number(atividade.obra.totalGeral),
      totalExecutado: atividade.obra.totalExecutado ? Number(atividade.obra.totalExecutado) : null,
      totalPendente: atividade.obra.totalPendente ? Number(atividade.obra.totalPendente) : null,
    },
    pavimento: {
      ...atividade.pavimento,
      areaM2: Number(atividade.pavimento.areaM2),
      areaExecutadaM2: atividade.pavimento.areaExecutadaM2 ? Number(atividade.pavimento.areaExecutadaM2) : null,
      percentualExecutado: atividade.pavimento.percentualExecutado ? Number(atividade.pavimento.percentualExecutado) : null,
      argamassaM3: Number(atividade.pavimento.argamassaM3),
      espessuraCM: atividade.pavimento.espessuraCM ? Number(atividade.pavimento.espessuraCM) : null,
    }
  }))
}

export async function findAtividadesByObra(obraId: string): Promise<AtividadeWithRelations[]> {
  const atividades = await db.atividade.findMany({
    where: { obraId },
    include: ATIVIDADE_INCLUDE,
    orderBy: { createdAt: 'desc' }
  })

  // Converter Decimal para number para compatibilidade com componentes cliente
  return atividades.map(atividade => ({
    ...atividade,
    aditivoM3: atividade.aditivoM3 ? Number(atividade.aditivoM3) : null,
    aditivoL: atividade.aditivoL ? Number(atividade.aditivoL) : null,
    saldoAcumuladoM2: atividade.saldoAcumuladoM2 ? Number(atividade.saldoAcumuladoM2) : null,
    obra: {
      ...atividade.obra,
      valorM2: Number(atividade.obra.valorM2),
      totalGeral: Number(atividade.obra.totalGeral),
      totalExecutado: atividade.obra.totalExecutado ? Number(atividade.obra.totalExecutado) : null,
      totalPendente: atividade.obra.totalPendente ? Number(atividade.obra.totalPendente) : null,
    },
    pavimento: {
      ...atividade.pavimento,
      areaM2: Number(atividade.pavimento.areaM2),
      areaExecutadaM2: atividade.pavimento.areaExecutadaM2 ? Number(atividade.pavimento.areaExecutadaM2) : null,
      percentualExecutado: atividade.pavimento.percentualExecutado ? Number(atividade.pavimento.percentualExecutado) : null,
      argamassaM3: Number(atividade.pavimento.argamassaM3),
      espessuraCM: atividade.pavimento.espessuraCM ? Number(atividade.pavimento.espessuraCM) : null,
    }
  }))
}

export async function findAtividadesByPavimento(pavimentoId: string): Promise<AtividadeWithRelations[]> {
  const atividades = await db.atividade.findMany({
    where: { pavimentoId },
    include: ATIVIDADE_INCLUDE,
    orderBy: { createdAt: 'desc' }
  })

  // Converter Decimal para number para compatibilidade com componentes cliente
  return atividades.map(atividade => ({
    ...atividade,
    aditivoM3: atividade.aditivoM3 ? Number(atividade.aditivoM3) : null,
    aditivoL: atividade.aditivoL ? Number(atividade.aditivoL) : null,
    saldoAcumuladoM2: atividade.saldoAcumuladoM2 ? Number(atividade.saldoAcumuladoM2) : null,
    obra: {
      ...atividade.obra,
      valorM2: Number(atividade.obra.valorM2),
      totalGeral: Number(atividade.obra.totalGeral),
      totalExecutado: atividade.obra.totalExecutado ? Number(atividade.obra.totalExecutado) : null,
      totalPendente: atividade.obra.totalPendente ? Number(atividade.obra.totalPendente) : null,
    },
    pavimento: {
      ...atividade.pavimento,
      areaM2: Number(atividade.pavimento.areaM2),
      areaExecutadaM2: atividade.pavimento.areaExecutadaM2 ? Number(atividade.pavimento.areaExecutadaM2) : null,
      percentualExecutado: atividade.pavimento.percentualExecutado ? Number(atividade.pavimento.percentualExecutado) : null,
      argamassaM3: Number(atividade.pavimento.argamassaM3),
      espessuraCM: atividade.pavimento.espessuraCM ? Number(atividade.pavimento.espessuraCM) : null,
    }
  }))
}

export async function findAtividadesByIntegrante(integranteId: string): Promise<AtividadeWithRelations[]> {
  const atividades = await db.atividade.findMany({
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

  // Converter Decimal para number para compatibilidade com componentes cliente
  return atividades.map(atividade => ({
    ...atividade,
    aditivoM3: atividade.aditivoM3 ? Number(atividade.aditivoM3) : null,
    aditivoL: atividade.aditivoL ? Number(atividade.aditivoL) : null,
    saldoAcumuladoM2: atividade.saldoAcumuladoM2 ? Number(atividade.saldoAcumuladoM2) : null,
    obra: {
      ...atividade.obra,
      valorM2: Number(atividade.obra.valorM2),
      totalGeral: Number(atividade.obra.totalGeral),
      totalExecutado: atividade.obra.totalExecutado ? Number(atividade.obra.totalExecutado) : null,
      totalPendente: atividade.obra.totalPendente ? Number(atividade.obra.totalPendente) : null,
    },
    pavimento: {
      ...atividade.pavimento,
      areaM2: Number(atividade.pavimento.areaM2),
      areaExecutadaM2: atividade.pavimento.areaExecutadaM2 ? Number(atividade.pavimento.areaExecutadaM2) : null,
      percentualExecutado: atividade.pavimento.percentualExecutado ? Number(atividade.pavimento.percentualExecutado) : null,
      argamassaM3: Number(atividade.pavimento.argamassaM3),
      espessuraCM: atividade.pavimento.espessuraCM ? Number(atividade.pavimento.espessuraCM) : null,
    }
  }))
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

  const atividade = await db.atividade.update({
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

  // Converter Decimal para number para compatibilidade com componentes cliente
  return {
    ...atividade,
    aditivoM3: atividade.aditivoM3 ? Number(atividade.aditivoM3) : null,
    aditivoL: atividade.aditivoL ? Number(atividade.aditivoL) : null,
    saldoAcumuladoM2: atividade.saldoAcumuladoM2 ? Number(atividade.saldoAcumuladoM2) : null,
    obra: {
      ...atividade.obra,
      valorM2: Number(atividade.obra.valorM2),
      totalGeral: Number(atividade.obra.totalGeral),
      totalExecutado: atividade.obra.totalExecutado ? Number(atividade.obra.totalExecutado) : null,
      totalPendente: atividade.obra.totalPendente ? Number(atividade.obra.totalPendente) : null,
    },
    pavimento: {
      ...atividade.pavimento,
      areaM2: Number(atividade.pavimento.areaM2),
      areaExecutadaM2: atividade.pavimento.areaExecutadaM2 ? Number(atividade.pavimento.areaExecutadaM2) : null,
      percentualExecutado: atividade.pavimento.percentualExecutado ? Number(atividade.pavimento.percentualExecutado) : null,
      argamassaM3: Number(atividade.pavimento.argamassaM3),
      espessuraCM: atividade.pavimento.espessuraCM ? Number(atividade.pavimento.espessuraCM) : null,
    }
  }
}

export async function deleteAtividade(id: string): Promise<void> {
  await db.atividade.delete({
    where: { id }
  })
}

// Função para calcular o saldo acumulado
async function calculateSaldoAcumulado(pavimentoId: string, areaM2Pavimento: Prisma.Decimal): Promise<number> {
  // Buscar a última atividade do pavimento com select otimizado
  const ultimaAtividade = await db.atividade.findFirst({
    where: { pavimentoId },
    select: { saldoAcumuladoM2: true },
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
  argamassaM3: string
  areaPreparadaAcumuladaM2?: string
  percentualPreparacao?: string
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
      argamassaM3: true,
      areaPreparadaAcumuladaM2: true,
      percentualPreparacao: true,
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
    id: p.id,
    identificador: p.identificador,
    areaM2: p.areaM2.toString(),
    argamassaM3: p.argamassaM3.toString(),
    areaPreparadaAcumuladaM2: p.areaPreparadaAcumuladaM2 ? p.areaPreparadaAcumuladaM2.toString() : undefined,
    percentualPreparacao: p.percentualPreparacao ? p.percentualPreparacao.toString() : undefined,
    torre: p.torre,
  }))
}