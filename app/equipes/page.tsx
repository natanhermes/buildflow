import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Users, Building2 } from "lucide-react"
import Link from "next/link"
import { mockEquipes, mockObras } from "@/lib/mock-data"

export default function EquipesPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <SidebarTrigger />
          <h2 className="text-3xl font-bold tracking-tight">Equipes</h2>
        </div>
        <Button asChild>
          <Link href="/equipes/nova">
            <Plus className="mr-2 h-4 w-4" />
            Nova Equipe
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {mockEquipes.map((equipe) => {
          const obra = mockObras.find((o) => o.id === equipe.obra_id)
          return (
            <Card key={equipe.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    {equipe.nome}
                  </CardTitle>
                  <Badge variant="outline">{equipe.integrantes.length} membros</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Building2 className="h-4 w-4" />
                  {obra?.nome || "Obra não encontrada"}
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Integrantes:</p>
                  <div className="space-y-1">
                    {equipe.integrantes.map((integrante, index) => (
                      <div key={index} className="text-sm text-muted-foreground">
                        • {integrante}
                      </div>
                    ))}
                  </div>
                </div>

                <Button variant="outline" className="w-full bg-transparent">
                  Gerenciar Equipe
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
