import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Building2, Plus } from "lucide-react"
import Link from "next/link"

export function EmptyState() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center justify-center p-6 text-center space-y-4">
          <div className="rounded-full bg-muted p-3">
            <Building2 className="h-6 w-6 text-muted-foreground" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Nenhuma obra encontrada</h3>
            <p className="text-sm text-muted-foreground">
              Você ainda não tem obras cadastradas. Comece criando sua primeira obra.
            </p>
          </div>

          <Button asChild>
            <Link href="/obras/nova">
              <Plus className="mr-2 h-4 w-4" />
              Nova Obra
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}