'use server'

import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { createAtividade } from '@/services/atividades/atividade.service'
import { atividadeSchema, type AtividadeFormData } from '@/lib/validations/atividade'
import { revalidatePath } from 'next/cache'

export type ActionState = {
  error?: string
  success?: boolean
  fieldErrors?: Record<string, string[]>
}

export async function createAtividadeAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return { error: 'Usuário não autenticado' }
    }

    const rawData = extractFormData(formData)
    
    const result = atividadeSchema.safeParse(rawData)
    
    if (!result.success) {
      return {
        fieldErrors: result.error.flatten().fieldErrors,
      }
    }

    const validatedData = result.data

    await createAtividade({
      ...validatedData,
      usuarioId: session.user.id,
      inicioExpediente: validatedData.inicioExpediente ? new Date(`1970-01-01T${validatedData.inicioExpediente}:00`) : undefined,
      inicioAlmoco: validatedData.inicioAlmoco ? new Date(`1970-01-01T${validatedData.inicioAlmoco}:00`) : undefined,
      fimAlmoco: validatedData.fimAlmoco ? new Date(`1970-01-01T${validatedData.fimAlmoco}:00`) : undefined,
      fimExpediente: validatedData.fimExpediente ? new Date(`1970-01-01T${validatedData.fimExpediente}:00`) : undefined,
    })

    revalidatePath('/atividades')
    
  } catch (error) {
    console.error('Erro ao criar atividade:', error)
    return { error: 'Erro interno do servidor' }
  }
  
  redirect('/atividades')
}

function extractFormData(formData: FormData): AtividadeFormData {
  // Extrair múltiplos integrantes
  const integranteIds: string[] = []
  const integrantesFormData = formData.getAll('integranteIds') as string[]
  integranteIds.push(...integrantesFormData.filter(id => id.trim() !== ''))

  const data: AtividadeFormData = {
    integranteIds,
    obraId: formData.get('obraId') as string,
    pavimentoId: formData.get('pavimentoId') as string,
  }

  // Campos opcionais
  const aditivoM3 = formData.get('aditivoM3') as string
  if (aditivoM3) data.aditivoM3 = Number(aditivoM3)

  const aditivoL = formData.get('aditivoL') as string
  if (aditivoL) data.aditivoL = Number(aditivoL)

  const execucao = formData.get('execucao') as string
  if (execucao) data.execucao = execucao as 'EXECUTADO' | 'INICIAL' | 'MEIO' | 'FINAL'

  const inicioExpediente = formData.get('inicioExpediente') as string
  if (inicioExpediente) data.inicioExpediente = inicioExpediente

  const inicioAlmoco = formData.get('inicioAlmoco') as string
  if (inicioAlmoco) data.inicioAlmoco = inicioAlmoco

  const fimAlmoco = formData.get('fimAlmoco') as string
  if (fimAlmoco) data.fimAlmoco = fimAlmoco

  const fimExpediente = formData.get('fimExpediente') as string
  if (fimExpediente) data.fimExpediente = fimExpediente

  const obsExecucao = formData.get('obsExecucao') as string
  if (obsExecucao) data.obsExecucao = obsExecucao

  const obsPonto = formData.get('obsPonto') as string
  if (obsPonto) data.obsPonto = obsPonto

  const obsQtdBetoneira = formData.get('obsQtdBetoneira') as string
  if (obsQtdBetoneira) data.obsQtdBetoneira = obsQtdBetoneira

  const obsHOI = formData.get('obsHOI') as string
  if (obsHOI) data.obsHOI = obsHOI

  return data
}