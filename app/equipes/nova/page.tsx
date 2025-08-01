import { Suspense } from 'react'
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { EquipeForm } from '@/components/equipes/equipe-form'
import { LoadingState } from '@/components/equipes/loading-state'

function NovaEquipeContent() {
  return (
    <Suspense fallback={<LoadingState />}>
      <EquipeForm />
    </Suspense>
  )
}

export default function NovaEquipePage() {
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
          <h2 className="text-3xl font-bold tracking-tight">Nova Equipe</h2>
        </div>
      </div>

      <NovaEquipeContent />
    </div>
  )
} 