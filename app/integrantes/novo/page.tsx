import { Suspense } from 'react'
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { IntegranteForm } from '@/components/integrantes/integrante-form'
import { LoadingState } from '@/components/integrantes/loading-state'

function NovoIntegranteContent() {
  return (
    <Suspense fallback={<LoadingState />}>
      <IntegranteForm />
    </Suspense>
  )
}

export default function NovoIntegrantePage() {
  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button asChild variant="ghost" size="sm">
            <Link href="/integrantes">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Link>
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">Novo Integrante</h2>
        </div>
      </div>

      <NovoIntegranteContent />
    </div>
  )
} 