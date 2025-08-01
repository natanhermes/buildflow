import { Suspense } from 'react'
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { EquipesList } from '@/components/equipes/equipes-list'
import { LoadingState } from '@/components/equipes/loading-state'

function EquipesContent() {
  return (
    <Suspense fallback={<LoadingState />}>
      <EquipesList />
    </Suspense>
  )
}

export default function EquipesPage() {
  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h2 className="text-3xl font-bold tracking-tight">Equipes</h2>
        </div>
        <div className="flex space-x-2">
          <Button asChild variant="outline">
            <Link href="/integrantes">
              <Plus className="mr-2 h-4 w-4" />
              Integrantes
            </Link>
          </Button>
          <Button asChild>
            <Link href="/equipes/nova">
              <Plus className="mr-2 h-4 w-4" />
              Nova Equipe
            </Link>
          </Button>
        </div>
      </div>

      <EquipesContent />
    </div>
  )
}
