import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Users, Plus } from "lucide-react"
import Link from "next/link"

export function EmptyState() {
  return (
    <Card className="flex flex-col items-center justify-center p-8">
      <CardContent className="flex flex-col items-center space-y-4 text-center">
        <div className="rounded-full bg-muted p-3">
          <Users className="h-6 w-6 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Nenhuma equipe encontrada</h3>
          <p className="text-sm text-muted-foreground">
            Comece criando sua primeira equipe para organizar os integrantes.
          </p>
        </div>
        <Button asChild>
          <Link href="/equipes/nova">
            <Plus className="mr-2 h-4 w-4" />
            Criar Equipe
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
} 