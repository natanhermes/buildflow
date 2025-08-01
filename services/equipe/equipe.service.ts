import db from '@/lib/db'
import { Equipe, Integrante, Obra, Prisma } from '@prisma/client'

export type EquipeWithRelations = Equipe & {
  obra: Obra
  integrantes: (Integrante & {
    equipe: Equipe
  })[]
}

export type CreateEquipeData = {
  nome: string
  obraId: string
}

export type AddIntegranteData = {
  nome: string
  equipeId: string
}

export async function createEquipe(data: CreateEquipeData): Promise<EquipeWithRelations> {
  // Verificar se a obra existe
  const obra = await db.obra.findUnique({
    where: { id: data.obraId }
  })

  if (!obra) {
    throw new Error('Obra não encontrada')
  }

  // Verificar se já existe uma equipe com o mesmo nome na mesma obra
  const equipeExistente = await db.equipe.findFirst({
    where: {
      nome: data.nome,
      obraId: data.obraId
    }
  })

  if (equipeExistente) {
    throw new Error('Já existe uma equipe com este nome nesta obra')
  }

  return await db.equipe.create({
    data: {
      nome: data.nome,
      obraId: data.obraId,
    },
    include: {
      obra: true,
      integrantes: {
        include: {
          equipe: true,
        }
      },
    }
  })
}

export async function findEquipeById(id: string): Promise<EquipeWithRelations | null> {
  return await db.equipe.findUnique({
    where: { id },
    include: {
      obra: true,
      integrantes: {
        include: {
          equipe: true,
        }
      },
    }
  })
}

export async function findEquipesByObra(obraId: string): Promise<EquipeWithRelations[]> {
  return await db.equipe.findMany({
    where: { obraId },
    include: {
      obra: true,
      integrantes: {
        include: {
          equipe: true,
        }
      },
    },
    orderBy: { createdAt: 'desc' }
  })
}

export async function findAllEquipes(): Promise<EquipeWithRelations[]> {
  return await db.equipe.findMany({
    include: {
      obra: true,
      integrantes: {
        include: {
          equipe: true,
        }
      },
    },
    orderBy: { createdAt: 'desc' }
  })
}

export async function updateEquipe(id: string, data: Partial<CreateEquipeData>): Promise<EquipeWithRelations> {
  return await db.equipe.update({
    where: { id },
    data,
    include: {
      obra: true,
      integrantes: {
        include: {
          equipe: true,
        }
      },
    }
  })
}

export async function deleteEquipe(id: string): Promise<void> {
  await db.equipe.delete({
    where: { id }
  })
}

export async function addIntegranteToEquipe(data: AddIntegranteData): Promise<Integrante> {
  return await db.integrante.create({
    data: {
      nome: data.nome,
      equipeId: data.equipeId,
    }
  })
}

export async function removeIntegranteFromEquipe(integranteId: string): Promise<void> {
  await db.integrante.delete({
    where: { id: integranteId }
  })
}

export async function moveIntegranteToEquipe(integranteId: string, novaEquipeId: string): Promise<Integrante> {
  return await db.integrante.update({
    where: { id: integranteId },
    data: { equipeId: novaEquipeId }
  })
} 