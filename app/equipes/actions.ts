'use server'

import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { createEquipe } from '@/services/equipe/equipe.service'
import { equipeSchema, type EquipeFormData } from '@/lib/validations/equipe'
import { revalidatePath } from 'next/cache'

export type ActionState = {
  error?: string
  success?: boolean
  fieldErrors?: Record<string, string[]>
}

export async function createEquipeAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return { error: 'Usuário não autenticado' }
    }

    const rawData = extractFormData(formData)
    
    const result = equipeSchema.safeParse(rawData)
    
    if (!result.success) {
      return {
        fieldErrors: result.error.flatten().fieldErrors,
      }
    }

    const validatedData = result.data

    await createEquipe(validatedData)

    revalidatePath('/equipes')
    
    return { success: true }
    
  } catch (error) {
    console.error('Erro ao criar equipe:', error)
    return { error: 'Erro interno do servidor' }
  }
}

function extractFormData(formData: FormData): EquipeFormData {
  return {
    nome: formData.get('nome') as string,
    obraId: formData.get('obraId') as string,
  }
} 