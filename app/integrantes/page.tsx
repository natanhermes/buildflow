import { Suspense } from 'react'
import { Button } from "@/components/ui/button"
import { Plus, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { IntegrantesList } from '@/components/integrantes/integrantes-list'
import { LoadingState } from '@/components/integrantes/loading-state'

function IntegrantesContent() {
  return (
    <Suspense fallback={<LoadingState />}>
      <IntegrantesList />
    </Suspense>
  )
}

export default function IntegrantesPage() {
  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button asChild variant="ghost" size="sm">
            <Link href="/equipes">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Link>
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">Integrantes</h2>
        </div>
        <Button asChild>
          <Link href="/integrantes/novo">
            <Plus className="mr-2 h-4 w-4" />
            Novo Integrante
          </Link>
        </Button>
      </div>

      <IntegrantesContent />
    </div>
  )
} 