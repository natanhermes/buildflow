import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Users } from "lucide-react"
import Link from "next/link"

export function EmptyState() {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <div className="rounded-full bg-muted p-4 mb-4">
          <Users className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Nenhum integrante encontrado</h3>
        <p className="text-muted-foreground text-center mb-6">
          Comece criando seu primeiro integrante para adicionar ao sistema.
        </p>
        <Button asChild>
          <Link href="/integrantes/novo">
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Integrante
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}