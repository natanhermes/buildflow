import { NextResponse } from 'next/server'
import { findPavimentosByObra } from '@/services/atividades/atividade.service'
import { auth } from '@/auth'

export async function GET(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const obraId = searchParams.get('obraId')

    if (!obraId) {
      return NextResponse.json({ error: 'ID da obra é obrigatório' }, { status: 400 })
    }

    const pavimentos = await findPavimentosByObra(obraId)
    return NextResponse.json(pavimentos)
  } catch (error) {
    console.error('Erro ao buscar pavimentos:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar pavimentos' },
      { status: 500 }
    )
  }
}