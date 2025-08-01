import { NextRequest, NextResponse } from 'next/server'
import { findAllIntegrantes, findIntegrantesByEquipe, createIntegrante } from '@/services/integrante/integrante.service'
import { auth } from '@/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const equipeId = searchParams.get('equipeId')

    let integrantes
    if (equipeId) {
      integrantes = await findIntegrantesByEquipe(equipeId)
    } else {
      integrantes = await findAllIntegrantes()
    }

    return NextResponse.json(integrantes)
  } catch (error) {
    console.error('Erro ao buscar integrantes:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar integrantes' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { nome, equipeId } = body

    if (!nome || !equipeId) {
      return NextResponse.json(
        { error: 'Nome e equipe são obrigatórios' },
        { status: 400 }
      )
    }

    const integrante = await createIntegrante({ nome, equipeId })
    return NextResponse.json(integrante, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar integrante:', error)
    return NextResponse.json(
      { error: 'Erro ao criar integrante' },
      { status: 500 }
    )
  }
} 