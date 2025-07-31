import { Suspense } from 'react'
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { ObrasList } from '@/components/obras/obras-list'
import { LoadingState } from '@/components/obras/loading-state'

function ObrasContent() {
  return (
    <Suspense fallback={<LoadingState />}>
      <ObrasList />
    </Suspense>
  )
}

export default function ObrasPage() {
  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h2 className="text-3xl font-bold tracking-tight">Obras</h2>
        </div>
        <Button asChild>
          <Link href="/obras/nova">
            <Plus className="mr-2 h-4 w-4" />
            Nova Obra
          </Link>
        </Button>
      </div>

      <ObrasContent />
    </div>
  )
}
