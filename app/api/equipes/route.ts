import { NextRequest, NextResponse } from 'next/server'
import { findAllEquipes, findEquipesByObra, createEquipe } from '@/services/equipe/equipe.service'
import { auth } from '@/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const obraId = searchParams.get('obraId')

    let equipes
    if (obraId) {
      equipes = await findEquipesByObra(obraId)
    } else {
      equipes = await findAllEquipes()
    }

    return NextResponse.json(equipes)
  } catch (error) {
    console.error('Erro ao buscar equipes:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar equipes' },
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
    const { nome, obraId } = body

    if (!nome || !obraId) {
      return NextResponse.json(
        { error: 'Nome e obra são obrigatórios' },
        { status: 400 }
      )
    }

    const equipe = await createEquipe({ nome, obraId })
    return NextResponse.json(equipe, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar equipe:', error)
    return NextResponse.json(
      { error: 'Erro ao criar equipe' },
      { status: 500 }
    )
  }
} 