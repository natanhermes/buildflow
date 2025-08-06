import { NextResponse } from 'next/server'
import { checkCpfExists } from '@/services/integrante/integrante.service'
import { auth } from '@/auth'

export async function GET(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const cpf = searchParams.get('cpf')

    if (!cpf) {
      return NextResponse.json({ error: 'CPF é obrigatório' }, { status: 400 })
    }

    const exists = await checkCpfExists(cpf)
    return NextResponse.json({ exists })
  } catch (error) {
    console.error('Erro ao verificar CPF:', error)
    return NextResponse.json(
      { error: 'Erro ao verificar CPF' },
      { status: 500 }
    )
  }
}