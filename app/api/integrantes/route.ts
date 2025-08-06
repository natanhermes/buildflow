import { NextResponse } from 'next/server'
import { findAllIntegrantes, findIntegrantesForSelect } from '@/services/integrante/integrante.service'
import { auth } from '@/auth'

export async function GET(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const forSelect = searchParams.get('forSelect') === 'true'

    if (forSelect) {
      const integrantes = await findIntegrantesForSelect()
      return NextResponse.json(integrantes)
    }

    const integrantes = await findAllIntegrantes()
    return NextResponse.json(integrantes)
  } catch (error) {
    console.error('Erro ao buscar integrantes:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar integrantes' },
      { status: 500 }
    )
  }
}