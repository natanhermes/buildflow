'use server'

import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import db from '@/lib/db'
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

    let criadoPorId = session.user.id
    const usuarioById = await db.usuario.findUnique({ where: { id: criadoPorId } })
    if (!usuarioById) {
      if (session.user.email) {
        const usuarioByEmail = await db.usuario.findUnique({ where: { email: session.user.email } })
        if (usuarioByEmail) {
          criadoPorId = usuarioByEmail.id
        } else {
          return { error: 'Usuário da sessão não encontrado. Faça logout e login novamente.' }
        }
      } else {
        return { error: 'Usuário da sessão inválido. Faça logout e login novamente.' }
      }
    }

    await createObra({
      nome: validatedData.nome,
      cei: validatedData.cei,
      construtora: validatedData.construtora,
      endereco: validatedData.endereco,
      enderecoCnpj: validatedData.enderecoCnpj,
      enderecoAcessoObra: validatedData.enderecoAcessoObra,
      razaoSocial: validatedData.razaoSocial,
      cnpj: validatedData.cnpj,
      codigoSFOBRAS: validatedData.codigoSFOBRAS,
      statusConsultaSPC: validatedData.statusConsultaSPC as any,
      baseCalcMaoObraMaterial: validatedData.baseCalcMaoObraMaterial,
      baseCalcLocacaoEquip: validatedData.baseCalcLocacaoEquip,
      medicaoPeriodoDias: validatedData.medicaoPeriodoDias,
      medicaoPrazoLiberacaoHoras: validatedData.medicaoPrazoLiberacaoHoras,
      contatos: validatedData.contatos,
      valorM2: validatedData.valorM2,
      dataInicio: new Date(validatedData.dataInicio),
      dataFim: new Date(validatedData.dataFim),
      torres: validatedData.torres,
      criadoPorId,
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

  const base = {
    nome: formData.get('nome') as string,
    cei: formData.get('cei') as string,
    construtora: formData.get('construtora') as string,
    endereco: {
      cep: formData.get('endereco.cep') as string,
      logradouro: formData.get('endereco.logradouro') as string,
      numero: formData.get('endereco.numero') as string,
      complemento: (formData.get('endereco.complemento') as string) || undefined,
      bairro: formData.get('endereco.bairro') as string,
      cidade: formData.get('endereco.cidade') as string,
      estado: formData.get('endereco.estado') as string,
    },
    valorM2: Number(formData.get('valorM2')) || 0,
    dataInicio: formData.get('dataInicio') as string,
    dataFim: formData.get('dataFim') as string,
    torres: torresData,
  } as any

  if (formData.get('enderecoCnpj.cep')) {
    base.enderecoCnpj = {
      cep: formData.get('enderecoCnpj.cep') as string,
      logradouro: formData.get('enderecoCnpj.logradouro') as string,
      numero: formData.get('enderecoCnpj.numero') as string,
      complemento: (formData.get('enderecoCnpj.complemento') as string) || undefined,
      bairro: formData.get('enderecoCnpj.bairro') as string,
      cidade: formData.get('enderecoCnpj.cidade') as string,
      estado: formData.get('enderecoCnpj.estado') as string,
    }
  }

  if (formData.get('enderecoAcessoObra.cep')) {
    base.enderecoAcessoObra = {
      cep: formData.get('enderecoAcessoObra.cep') as string,
      logradouro: formData.get('enderecoAcessoObra.logradouro') as string,
      numero: formData.get('enderecoAcessoObra.numero') as string,
      complemento: (formData.get('enderecoAcessoObra.complemento') as string) || undefined,
      bairro: formData.get('enderecoAcessoObra.bairro') as string,
      cidade: formData.get('enderecoAcessoObra.cidade') as string,
      estado: formData.get('enderecoAcessoObra.estado') as string,
    }
  }

  base.razaoSocial = (formData.get('razaoSocial') as string) || undefined
  base.cnpj = (formData.get('cnpj') as string) || undefined
  base.codigoSFOBRAS = (formData.get('codigoSFOBRAS') as string) || undefined
  base.statusConsultaSPC = (formData.get('statusConsultaSPC') as string) || undefined
  base.baseCalcMaoObraMaterial = formData.get('baseCalcMaoObraMaterial') ? Number(formData.get('baseCalcMaoObraMaterial')) : undefined
  base.baseCalcLocacaoEquip = formData.get('baseCalcLocacaoEquip') ? Number(formData.get('baseCalcLocacaoEquip')) : undefined
  base.medicaoPeriodoDias = formData.get('medicaoPeriodoDias') ? Number(formData.get('medicaoPeriodoDias')) : undefined
  base.medicaoPrazoLiberacaoHoras = formData.get('medicaoPrazoLiberacaoHoras') ? Number(formData.get('medicaoPrazoLiberacaoHoras')) : undefined

  // contatos dinâmicos
  const contatos: any[] = []
  let cIndex = 0
  while (formData.has(`contatos.${cIndex}.nome`) || formData.has(`contatos.${cIndex}.funcao`)) {
    const nome = formData.get(`contatos.${cIndex}.nome`) as string
    const funcao = formData.get(`contatos.${cIndex}.funcao`) as string
    const email = (formData.get(`contatos.${cIndex}.email`) as string) || undefined
    const telefone = (formData.get(`contatos.${cIndex}.telefone`) as string) || undefined
    if (nome && funcao) {
      contatos.push({ nome, funcao, email, telefone })
    }
    cIndex++
  }
  if (contatos.length > 0) {
    base.contatos = contatos
  }

  return base
} 