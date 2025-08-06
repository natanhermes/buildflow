import { NextResponse } from 'next/server'
import { findAllObras } from '@/services/obra/obra.service'
import { auth } from '@/auth'
import { serializeObject } from '@/lib/utils/serialization'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const obras = await findAllObras()
    const serializedObras = serializeObject(obras)
    return NextResponse.json(serializedObras)
  } catch (error) {
    console.error('Erro ao buscar obras:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar obras' },
      { status: 500 }
    )
  }
}
