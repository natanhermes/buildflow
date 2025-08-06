import { NextResponse } from 'next/server'
import { findAtividadeById, updateAtividade, deleteAtividade } from '@/services/atividades/atividade.service'
import { atividadeSchema } from '@/lib/validations/atividade'
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

    const atividade = await findAtividadeById(params.id)
    
    if (!atividade) {
      return NextResponse.json({ error: 'Atividade não encontrada' }, { status: 404 })
    }

    return NextResponse.json(atividade)
  } catch (error) {
    console.error('Erro ao buscar atividade:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar atividade' },
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
    const result = atividadeSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: result.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const atividade = await updateAtividade(params.id, {
      ...result.data,
      inicioExpediente: result.data.inicioExpediente ? new Date(`1970-01-01T${result.data.inicioExpediente}:00`) : undefined,
      inicioAlmoco: result.data.inicioAlmoco ? new Date(`1970-01-01T${result.data.inicioAlmoco}:00`) : undefined,
      fimAlmoco: result.data.fimAlmoco ? new Date(`1970-01-01T${result.data.fimAlmoco}:00`) : undefined,
      fimExpediente: result.data.fimExpediente ? new Date(`1970-01-01T${result.data.fimExpediente}:00`) : undefined,
    })
    
    return NextResponse.json(atividade)
  } catch (error) {
    console.error('Erro ao atualizar atividade:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar atividade' },
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

    await deleteAtividade(params.id)
    return NextResponse.json({ message: 'Atividade excluída com sucesso' })
  } catch (error) {
    console.error('Erro ao excluir atividade:', error)
    return NextResponse.json(
      { error: 'Erro ao excluir atividade' },
      { status: 500 }
    )
  }
}