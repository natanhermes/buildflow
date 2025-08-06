import { NextResponse } from 'next/server'
import { findIntegranteById, updateIntegrante, deleteIntegrante } from '@/services/integrante/integrante.service'
import { integranteSchema } from '@/lib/validations/integrante'
import { auth } from '@/auth'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const integrante = await findIntegranteById(params.id)
    
    if (!integrante) {
      return NextResponse.json({ error: 'Integrante não encontrado' }, { status: 404 })
    }

    return NextResponse.json(integrante)
  } catch (error) {
    console.error('Erro ao buscar integrante:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar integrante' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const result = integranteSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: result.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const integrante = await updateIntegrante(params.id, result.data)
    return NextResponse.json(integrante)
  } catch (error) {
    console.error('Erro ao atualizar integrante:', error)
    if (error instanceof Error && error.message.includes('CPF')) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json(
      { error: 'Erro ao atualizar integrante' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    await deleteIntegrante(params.id)
    return NextResponse.json({ message: 'Integrante excluído com sucesso' })
  } catch (error) {
    console.error('Erro ao excluir integrante:', error)
    return NextResponse.json(
      { error: 'Erro ao excluir integrante' },
      { status: 500 }
    )
  }
}