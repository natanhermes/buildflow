import db from '@/lib/db'
import { Integrante } from '@prisma/client'

export type IntegranteWithRelations = Integrante & {
  atividadeIntegrantes?: {
    atividade: {
      id: string
      obra: {
        id: string
        nome: string
      }
      pavimento: {
        id: string
        identificador: string
      }
    }
  }[]
}

// Constante para padronizar includes
const INTEGRANTE_INCLUDE = {
  atividadeIntegrantes: {
    include: {
      atividade: {
        include: {
          obra: {
            select: {
              id: true,
              nome: true,
            }
          },
          pavimento: {
            select: {
              id: true,
              identificador: true,
            }
          }
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  }
} as const

const INTEGRANTE_INCLUDE_LIMITED = {
  atividadeIntegrantes: {
    include: {
      atividade: {
        include: {
          obra: {
            select: {
              id: true,
              nome: true,
            }
          },
          pavimento: {
            select: {
              id: true,
              identificador: true,
            }
          }
        }
      }
    },
    orderBy: { createdAt: 'desc' },
    take: 5
  }
} as const

export type CreateIntegranteData = {
  nome: string
  cpf: string
}

export async function createIntegrante(data: CreateIntegranteData): Promise<IntegranteWithRelations> {
  // Verificar se já existe um integrante com o mesmo CPF
  const integranteExistente = await db.integrante.findUnique({
    where: { cpf: data.cpf }
  })

  if (integranteExistente) {
    throw new Error('Já existe um integrante cadastrado com este CPF')
  }

  return await db.integrante.create({
    data: {
      nome: data.nome,
      cpf: data.cpf,
    },
    include: INTEGRANTE_INCLUDE_LIMITED
  })
}

export async function findIntegranteById(id: string): Promise<IntegranteWithRelations | null> {
  return await db.integrante.findUnique({
    where: { id },
    include: INTEGRANTE_INCLUDE
  })
}

export async function findAllIntegrantes(): Promise<IntegranteWithRelations[]> {
  return await db.integrante.findMany({
    include: {
      atividadeIntegrantes: {
        include: {
          atividade: {
            include: {
              obra: {
                select: {
                  id: true,
                  nome: true,
                }
              },
              pavimento: {
                select: {
                  id: true,
                  identificador: true,
                }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 3
      }
    },
    orderBy: { nome: 'asc' }
  })
}

export async function findIntegrantesByCpf(cpf: string): Promise<IntegranteWithRelations | null> {
  return await db.integrante.findUnique({
    where: { cpf },
    include: INTEGRANTE_INCLUDE
  })
}

export async function updateIntegrante(id: string, data: Partial<CreateIntegranteData>): Promise<IntegranteWithRelations> {
  // Se o CPF está sendo atualizado, verificar se não existe outro integrante com esse CPF
  if (data.cpf) {
    const integranteExistente = await db.integrante.findUnique({
      where: { cpf: data.cpf }
    })
    
    if (integranteExistente && integranteExistente.id !== id) {
      throw new Error('Já existe um integrante cadastrado com este CPF')
    }
  }

  return await db.integrante.update({
    where: { id },
    data,
    include: INTEGRANTE_INCLUDE_LIMITED
  })
}

export async function deleteIntegrante(id: string): Promise<void> {
  await db.integrante.delete({
    where: { id }
  })
}

export async function checkCpfExists(cpf: string): Promise<boolean> {
  const integrante = await db.integrante.findUnique({
    where: { cpf }
  })
  return !!integrante
}

export async function findIntegrantesForSelect(): Promise<{ id: string; nome: string; cpf: string }[]> {
  return await db.integrante.findMany({
    select: {
      id: true,
      nome: true,
      cpf: true,
    },
    orderBy: { nome: 'asc' }
  })
} 