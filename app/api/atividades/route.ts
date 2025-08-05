import { NextResponse } from 'next/server'
import { findAllAtividades, findAtividadesByObra } from '@/services/atividades/atividade.service'
import { auth } from '@/auth'

export async function GET(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const obraId = searchParams.get('obraId')

    if (obraId) {
      const atividades = await findAtividadesByObra(obraId)
      return NextResponse.json(atividades)
    }

    const atividades = await findAllAtividades()
    return NextResponse.json(atividades)
  } catch (error) {
    console.error('Erro ao buscar atividades:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar atividades' },
      { status: 500 }
    )
  }
}