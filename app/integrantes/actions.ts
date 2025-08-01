'use server'

import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { createIntegrante } from '@/services/integrante/integrante.service'
import { integranteSchema, type IntegranteFormData } from '@/lib/validations/integrante'
import { revalidatePath } from 'next/cache'

export type ActionState = {
  error?: string
  success?: boolean
  fieldErrors?: Record<string, string[]>
}

export async function createIntegranteAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return { error: 'Usuário não autenticado' }
    }

    const rawData = extractFormData(formData)
    
    const result = integranteSchema.safeParse(rawData)
    
    if (!result.success) {
      return {
        fieldErrors: result.error.flatten().fieldErrors,
      }
    }

    const validatedData = result.data

    await createIntegrante(validatedData)

    revalidatePath('/integrantes')
    
    return { success: true }
    
  } catch (error) {
    console.error('Erro ao criar integrante:', error)
    return { error: 'Erro interno do servidor' }
  }
}

function extractFormData(formData: FormData): IntegranteFormData {
  return {
    nome: formData.get('nome') as string,
    equipeId: formData.get('equipeId') as string,
  }
} 