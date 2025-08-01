import db from '@/lib/db'
import { Integrante, Equipe } from '@prisma/client'

export type IntegranteWithRelations = Integrante & {
  equipe: Equipe & {
    obra: {
      id: string
      nome: string
      cei: string
    }
  }
}

export type CreateIntegranteData = {
  nome: string
  equipeId: string
}

export async function createIntegrante(data: CreateIntegranteData): Promise<IntegranteWithRelations> {
  // Verificar se a equipe existe
  const equipe = await db.equipe.findUnique({
    where: { id: data.equipeId }
  })

  if (!equipe) {
    throw new Error('Equipe não encontrada')
  }

  // Verificar se já existe um integrante com o mesmo nome na mesma equipe
  const integranteExistente = await db.integrante.findFirst({
    where: {
      nome: data.nome,
      equipeId: data.equipeId
    }
  })

  if (integranteExistente) {
    throw new Error('Já existe um integrante com este nome nesta equipe')
  }

  return await db.integrante.create({
    data: {
      nome: data.nome,
      equipeId: data.equipeId,
    },
    include: {
      equipe: {
        include: {
          obra: {
            select: {
              id: true,
              nome: true,
              cei: true,
            }
          }
        }
      },
    }
  })
}

export async function findIntegranteById(id: string): Promise<IntegranteWithRelations | null> {
  return await db.integrante.findUnique({
    where: { id },
    include: {
      equipe: {
        include: {
          obra: {
            select: {
              id: true,
              nome: true,
              cei: true,
            }
          }
        }
      },
    }
  })
}

export async function findAllIntegrantes(): Promise<IntegranteWithRelations[]> {
  return await db.integrante.findMany({
    include: {
      equipe: {
        include: {
          obra: {
            select: {
              id: true,
              nome: true,
              cei: true,
            }
          }
        }
      },
    },
    orderBy: { nome: 'asc' }
  })
}

export async function findIntegrantesByEquipe(equipeId: string): Promise<IntegranteWithRelations[]> {
  return await db.integrante.findMany({
    where: { equipeId },
    include: {
      equipe: {
        include: {
          obra: {
            select: {
              id: true,
              nome: true,
              cei: true,
            }
          }
        }
      },
    },
    orderBy: { nome: 'asc' }
  })
}

export async function updateIntegrante(id: string, data: Partial<CreateIntegranteData>): Promise<IntegranteWithRelations> {
  return await db.integrante.update({
    where: { id },
    data,
    include: {
      equipe: {
        include: {
          obra: {
            select: {
              id: true,
              nome: true,
              cei: true,
            }
          }
        }
      },
    }
  })
}

export async function deleteIntegrante(id: string): Promise<void> {
  await db.integrante.delete({
    where: { id }
  })
}

export async function moveIntegranteToEquipe(integranteId: string, novaEquipeId: string): Promise<IntegranteWithRelations> {
  return await db.integrante.update({
    where: { id: integranteId },
    data: { equipeId: novaEquipeId },
    include: {
      equipe: {
        include: {
          obra: {
            select: {
              id: true,
              nome: true,
              cei: true,
            }
          }
        }
      },
    }
  })
} 