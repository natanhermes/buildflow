import { findAllAtividades } from '@/services/atividades/atividade.service'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export async function AtividadesList() {
  const atividades = await findAllAtividades()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de Atividades</CardTitle>
      </CardHeader>
      <CardContent>
        {atividades.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>Nenhuma atividade encontrada.</p>
            <p className="text-sm">Clique em "Nova Atividade" para adicionar a primeira atividade.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Obra</TableHead>
                <TableHead>Pavimento</TableHead>
                <TableHead>Integrante</TableHead>
                <TableHead>Execução</TableHead>
                <TableHead>Saldo Acumulado</TableHead>
                <TableHead>Aditivos</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {atividades.map((atividade) => (
                <TableRow key={atividade.id}>
                  <TableCell className="font-medium">
                    {format(atividade.createdAt, "dd/MM/yyyy", { locale: ptBR })}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{atividade.obra.nome}</p>
                      <p className="text-sm text-muted-foreground">{atividade.obra.cei}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{atividade.pavimento.torre.nome}</p>
                      <p className="text-sm text-muted-foreground">{atividade.pavimento.identificador}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {atividade.atividadeIntegrantes.slice(0, 2).map((ai) => (
                        <div key={ai.integrante.id} className="text-sm">
                          {ai.integrante.nome}
                        </div>
                      ))}
                      {atividade.atividadeIntegrantes.length > 2 && (
                        <div className="text-xs text-muted-foreground">
                          +{atividade.atividadeIntegrantes.length - 2} outros
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {atividade.execucao && (
                      <Badge variant={
                        atividade.execucao === 'EXECUTADO' ? 'default' :
                        atividade.execucao === 'FINAL' ? 'secondary' :
                        'outline'
                      }>
                        {atividade.execucao === 'EXECUTADO' ? 'Executado' :
                         atividade.execucao === 'INICIAL' ? 'Inicial' :
                         atividade.execucao === 'MEIO' ? 'Em andamento' :
                         atividade.execucao === 'FINAL' ? 'Final' : atividade.execucao}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {atividade.saldoAcumuladoM2 ? (
                      <span className="font-mono">{Number(atividade.saldoAcumuladoM2).toFixed(2)}m²</span>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {atividade.aditivoM3 && (
                        <div>{Number(atividade.aditivoM3).toFixed(2)}m³</div>
                      )}
                      {atividade.aditivoL && (
                        <div>{Number(atividade.aditivoL).toFixed(2)}L</div>
                      )}
                      {!atividade.aditivoM3 && !atividade.aditivoL && '-'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      Editar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}