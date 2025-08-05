import { Suspense } from 'react'
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { AtividadesList } from '@/components/atividades/atividades-list'
import { LoadingState } from '@/components/atividades/loading-state'

function AtividadesContent() {
  return (
    <Suspense fallback={<LoadingState />}>
      <AtividadesList />
    </Suspense>
  )
}

export default function AtividadesPage() {
  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h2 className="text-3xl font-bold tracking-tight">Atividades</h2>
        </div>
        <Button asChild>
          <Link href="/atividades/nova">
            <Plus className="mr-2 h-4 w-4" />
            Nova Atividade
          </Link>
        </Button>
      </div>

      <AtividadesContent />
    </div>
  )
}
