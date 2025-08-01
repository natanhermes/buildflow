import { NextRequest, NextResponse } from 'next/server'
import { updateIntegrante, deleteIntegrante, moveIntegranteToEquipe } from '@/services/integrante/integrante.service'
import { auth } from '@/auth'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { nome, equipeId } = body

    if (!nome && !equipeId) {
      return NextResponse.json(
        { error: 'Pelo menos um campo deve ser fornecido' },
        { status: 400 }
      )
    }

    const updateData: any = {}
    if (nome) updateData.nome = nome
    if (equipeId) updateData.equipeId = equipeId

    const integrante = await updateIntegrante(params.id, updateData)
    return NextResponse.json(integrante)
  } catch (error) {
    console.error('Erro ao atualizar integrante:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar integrante' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    await deleteIntegrante(params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao deletar integrante:', error)
    return NextResponse.json(
      { error: 'Erro ao deletar integrante' },
      { status: 500 }
    )
  }
} 