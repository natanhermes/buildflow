import { NextResponse } from 'next/server'
import { findAllAtividades, findAtividadesByObra } from '@/services/atividades/atividade.service'
import { auth } from '@/auth'
import { serializeObject } from '@/lib/utils/serialization'

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
      const serializedAtividades = serializeObject(atividades)
      return NextResponse.json(serializedAtividades)
    }

    const atividades = await findAllAtividades()
    const serializedAtividades = serializeObject(atividades)
    return NextResponse.json(serializedAtividades)
  } catch (error) {
    console.error('Erro ao buscar atividades:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar atividades' },
      { status: 500 }
    )
  }
}