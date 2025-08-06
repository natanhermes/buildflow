import { NextResponse } from 'next/server'
import { findAtividadesByIntegrante } from '@/services/atividades/atividade.service'
import { auth } from '@/auth'
import { serializeObject } from '@/lib/utils/serialization'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const integranteId = params.id
    
    if (!integranteId) {
      return NextResponse.json(
        { error: 'ID do integrante é obrigatório' },
        { status: 400 }
      )
    }

    const atividades = await findAtividadesByIntegrante(integranteId)
    const serializedAtividades = serializeObject(atividades)
    return NextResponse.json(serializedAtividades)
  } catch (error) {
    console.error('Erro ao buscar atividades do integrante:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar atividades do integrante' },
      { status: 500 }
    )
  }
}