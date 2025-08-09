import db from '@/lib/db'
import { Obra, Torre, Pavimento, Prisma, ContatoObra, Endereco } from '@prisma/client'

export type ObraWithRelations = Obra & {
  endereco?: Endereco | null
  enderecoCnpj?: Endereco | null
  enderecoAcessoObra?: Endereco | null
  contatos: ContatoObra[]
  torres: (Torre & { pavimentos: Pavimento[] })[]
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
  enderecoCnpj?: {
    cep: string
    logradouro: string
    numero: string
    complemento?: string
    bairro: string
    cidade: string
    estado: string
  }
  enderecoAcessoObra?: {
    cep: string
    logradouro: string
    numero: string
    complemento?: string
    bairro: string
    cidade: string
    estado: string
  }
  razaoSocial?: string
  cnpj?: string
  codigoSFOBRAS?: string
  statusConsultaSPC?: 'NAO_REALIZADA' | 'REALIZADA_SEM_PENDENCIAS' | 'REALIZADA_COM_PENDENCIAS'
  baseCalcMaoObraMaterial?: number
  baseCalcLocacaoEquip?: number
  medicaoPeriodoDias?: number
  medicaoPrazoLiberacaoHoras?: number
  contatos?: Array<{ funcao: string; nome: string; email?: string; telefone?: string }>
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

  let enderecoCnpjCreatedId: string | undefined
  if (data.enderecoCnpj) {
    const created = await db.endereco.create({
      data: {
        logradouro: data.enderecoCnpj.logradouro,
        numero: data.enderecoCnpj.numero,
        complemento: data.enderecoCnpj.complemento,
        bairro: data.enderecoCnpj.bairro,
        cidade: data.enderecoCnpj.cidade,
        estado: data.enderecoCnpj.estado,
      }
    })
    enderecoCnpjCreatedId = created.id
  }

  let enderecoAcessoObraCreatedId: string | undefined
  if (data.enderecoAcessoObra) {
    const created = await db.endereco.create({
      data: {
        logradouro: data.enderecoAcessoObra.logradouro,
        numero: data.enderecoAcessoObra.numero,
        complemento: data.enderecoAcessoObra.complemento,
        bairro: data.enderecoAcessoObra.bairro,
        cidade: data.enderecoAcessoObra.cidade,
        estado: data.enderecoAcessoObra.estado,
      }
    })
    enderecoAcessoObraCreatedId = created.id
  }

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
      enderecoObraId: enderecoCreated.id,
      enderecoCnpjId: enderecoCnpjCreatedId,
      enderecoAcessoObraId: enderecoAcessoObraCreatedId,
      razaoSocial: data.razaoSocial ?? null,
      cnpj: data.cnpj ?? null,
      codigoSFOBRAS: data.codigoSFOBRAS ?? null,
      statusConsultaSPC: data.statusConsultaSPC ?? 'NAO_REALIZADA',
      baseCalcMaoObraMaterial: data.baseCalcMaoObraMaterial ? new Prisma.Decimal(data.baseCalcMaoObraMaterial) : null,
      baseCalcLocacaoEquip: data.baseCalcLocacaoEquip ? new Prisma.Decimal(data.baseCalcLocacaoEquip) : null,
      medicaoPeriodoDias: data.medicaoPeriodoDias ?? 15,
      medicaoPrazoLiberacaoHoras: data.medicaoPrazoLiberacaoHoras ?? 48,
      torres: {
        create: torres.map(torre => ({
          nome: torre.nome,
          pavimentos: {
            create: torre.pavimentos.map(pavimento => ({
              identificador: pavimento.identificador,
              areaM2: new Prisma.Decimal(pavimento.areaM2),
              argamassaM3: new Prisma.Decimal(0),
            }))
          }
        }))
      }
    },
    include: {
      endereco: true,
      enderecoCnpj: true,
      enderecoAcessoObra: true,
      contatos: true,
      torres: { include: { pavimentos: true } }
    }
  })

  if (data.contatos && data.contatos.length > 0) {
    await db.contatoObra.createMany({
      data: data.contatos.map(c => ({
        obraId: obra.id,
        funcao: c.funcao,
        nome: c.nome,
        email: c.email,
        telefone: c.telefone,
      }))
    })
  }

  return obra
}

export async function findObraById(id: string): Promise<ObraWithRelations | null> {
  return await db.obra.findUnique({
    where: { id },
    include: {
      endereco: true,
      enderecoCnpj: true,
      enderecoAcessoObra: true,
      contatos: true,
      torres: { include: { pavimentos: true } }
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
      enderecoCnpj: true,
      enderecoAcessoObra: true,
      contatos: true,
      torres: { include: { pavimentos: true } }
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