'use server'

import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { createObra, checkCeiExists } from '@/services/obra/obra.service'
import { obraSchema, type ObraFormData } from '@/lib/validations/obra'
import { revalidatePath } from 'next/cache'

export type ActionState = {
  error?: string
  success?: boolean
  fieldErrors?: Record<string, string[]>
}

export async function createObraAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return { error: 'Usuário não autenticado' }
    }

    const rawData = extractFormData(formData)
    
    const result = obraSchema.safeParse(rawData)
    
    if (!result.success) {
      return {
        fieldErrors: result.error.flatten().fieldErrors,
      }
    }

    const validatedData = result.data

    const ceiExists = await checkCeiExists(validatedData.cei)
    if (ceiExists) {
      return {
        fieldErrors: {
          cei: ['CEI já cadastrado no sistema']
        }
      }
    }

    await createObra({
      nome: validatedData.nome,
      cei: validatedData.cei,
      construtora: validatedData.construtora,
      endereco: validatedData.endereco,
      valorM2: validatedData.valorM2,
      dataInicio: new Date(validatedData.dataInicio),
      dataFim: new Date(validatedData.dataFim),
      torres: validatedData.torres,
      criadoPorId: session.user.id,
    })

    revalidatePath('/obras')
    
  } catch (error) {
    console.error('Erro ao criar obra:', error)
    return { error: 'Erro interno do servidor' }
  }
  
  redirect('/obras')
}

function extractFormData(formData: FormData): ObraFormData {
  const torresData: any[] = []
  
  let torreIndex = 0
  while (formData.has(`torres.${torreIndex}.nome`)) {
    const torre = {
      nome: formData.get(`torres.${torreIndex}.nome`) as string,
      pavimentos: [] as any[]
    }
    
    let pavIndex = 0
    while (formData.has(`torres.${torreIndex}.pavimentos.${pavIndex}.identificador`)) {
      const pavimento = {
        identificador: formData.get(`torres.${torreIndex}.pavimentos.${pavIndex}.identificador`) as string,
        areaM2: Number(formData.get(`torres.${torreIndex}.pavimentos.${pavIndex}.areaM2`)) || 0,
        argamassaM3: Number(formData.get(`torres.${torreIndex}.pavimentos.${pavIndex}.argamassaM3`)) || 0,
        espessuraCM: Number(formData.get(`torres.${torreIndex}.pavimentos.${pavIndex}.espessuraCM`)) || 0,
      }
      torre.pavimentos.push(pavimento)
      pavIndex++
    }
    
    torresData.push(torre)
    torreIndex++
  }

  return {
    nome: formData.get('nome') as string,
    cei: formData.get('cei') as string,
    construtora: formData.get('construtora') as string,
    endereco: {
      cep: formData.get('endereco.cep') as string,
      logradouro: formData.get('endereco.logradouro') as string,
      numero: formData.get('endereco.numero') as string,
      complemento: formData.get('endereco.complemento') as string || undefined,
      bairro: formData.get('endereco.bairro') as string,
      cidade: formData.get('endereco.cidade') as string,
      estado: formData.get('endereco.estado') as string,
    },
    valorM2: Number(formData.get('valorM2')) || 0,
    dataInicio: formData.get('dataInicio') as string,
    dataFim: formData.get('dataFim') as string,
    torres: torresData,
  }
} 