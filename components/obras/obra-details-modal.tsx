"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, MapPin, Calendar, DollarSign, Layers, ContactRound } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { type SerializedObraWithRelations } from "@/hooks/obras/use-obras"
import { formatCurrency, formatNumber } from "@/lib/utils"

interface ObraDetailsModalProps {
  obra: SerializedObraWithRelations | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ObraDetailsModal({ obra, open, onOpenChange }: ObraDetailsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            {obra?.nome || "Detalhes da Obra"}
          </DialogTitle>
          <DialogDescription>
            Informações completas da obra e seus relacionamentos
          </DialogDescription>
        </DialogHeader>

        {obra && (
          <div className="space-y-6">
            {/* Informações Básicas */}
            <Card>
              <CardHeader>
                <CardTitle>Informações Básicas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Nome:</span>
                    <span>{obra.nome}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium">CEI:</span>
                    <Badge variant="outline">{obra.cei}</Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Valor/m²:</span>
                    <span>{formatCurrency(Number(obra.valorM2))}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                  <div className="flex gap-2">
                    <span className="font-medium">Localidade:</span>
                    <p className="text-muted-foreground">
                      {obra.endereco ? `${obra.endereco.logradouro}, ${obra.endereco.numero} - ${obra.endereco.bairro}, ${obra.endereco.cidade}/${obra.endereco.estado}` : 'Endereço não informado'}
                    </p>
                  </div>
                </div>

                {obra.enderecoCnpj && (
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                    <div className="flex gap-2">
                      <span className="font-medium">Endereço CNPJ:</span>
                      <p className="text-muted-foreground">
                        {`${obra.enderecoCnpj.logradouro}, ${obra.enderecoCnpj.numero} - ${obra.enderecoCnpj.bairro}, ${obra.enderecoCnpj.cidade}/${obra.enderecoCnpj.estado}`}
                      </p>
                    </div>
                  </div>
                )}

                {obra.enderecoAcessoObra && (
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                    <div className="flex gap-2">
                      <span className="font-medium">Acesso Obra:</span>
                      <p className="text-muted-foreground">
                        {`${obra.enderecoAcessoObra.logradouro}, ${obra.enderecoAcessoObra.numero} - ${obra.enderecoAcessoObra.bairro}, ${obra.enderecoAcessoObra.cidade}/${obra.enderecoAcessoObra.estado}`}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Período:</span>
                  <span>
                    {obra.dataInicio && obra.dataFim ? (
                      <>
                        {format(new Date(obra.dataInicio), "dd/MM/yyyy", { locale: ptBR })} -{" "}
                        {format(new Date(obra.dataFim), "dd/MM/yyyy", { locale: ptBR })}
                      </>
                    ) : 'Datas não informadas'}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Andamento da Obra</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium text-blue-600">Total Geral</p>
                    <p className="text-2xl font-bold text-blue-800">
                      {formatNumber(Number(obra.totalGeral))} m²
                    </p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-sm font-medium text-green-600">Executado</p>
                    <p className="text-2xl font-bold text-green-800">
                      {formatNumber(Number(obra.totalExecutado))} m²
                    </p>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <p className="text-sm font-medium text-orange-600">Pendente</p>
                    <p className="text-2xl font-bold text-orange-800">
                      {formatNumber(Number(obra.totalGeral) - Number(obra.totalExecutado ?? 0))} m²
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Dados Cadastrais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <span className="font-medium">Razão Social: </span>
                    <span>{obra.razaoSocial || '-'}</span>
                  </div>
                  <div>
                    <span className="font-medium">CNPJ: </span>
                    <span>{obra.cnpj || '-'}</span>
                  </div>
                  <div>
                    <span className="font-medium">SFOBRAS: </span>
                    <span>{obra.codigoSFOBRAS || '-'}</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <span className="font-medium">SPC: </span>
                    <span>{obra.statusConsultaSPC}</span>
                  </div>
                  <div>
                    <span className="font-medium">% Mão Obra/Material: </span>
                    <span>{obra.baseCalcMaoObraMaterial ?? '-'}%</span>
                  </div>
                  <div>
                    <span className="font-medium">% Locação Equip: </span>
                    <span>{obra.baseCalcLocacaoEquip ?? '-'}%</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="font-medium">Período Medição (dias): </span>
                    <span>{obra.medicaoPeriodoDias}</span>
                  </div>
                  <div>
                    <span className="font-medium">Prazo Liberação (h): </span>
                    <span>{obra.medicaoPrazoLiberacaoHoras}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {obra.contatos && obra.contatos.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ContactRound className="h-5 w-5" />
                    Contatos da Obra
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  {obra.contatos.map((c) => (
                    <div key={c.id} className="grid grid-cols-1 md:grid-cols-4 gap-2 p-3 bg-gray-50 rounded">
                      <div><span className="font-medium">Função: </span>{c.funcao}</div>
                      <div><span className="font-medium">Nome: </span>{c.nome}</div>
                      <div><span className="font-medium">Email: </span>{c.email || '-'}</div>
                      <div><span className="font-medium">Telefone: </span>{c.telefone || '-'}</div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Estatísticas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layers className="h-5 w-5" />
                  Estatísticas da Obra
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{obra.torres.length}</p>
                    <p className="text-sm text-muted-foreground">{obra.torres.length > 1 ? 'Torres' : 'Torre'}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{obra.torres.reduce((total, torre) => total + torre.pavimentos.length, 0)}</p>
                    <p className="text-sm text-muted-foreground">{obra.torres.reduce((total, torre) => total + torre.pavimentos.length, 0) > 1 ? 'Pavimentos' : 'Pavimento'}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">
                      {Math.round((Number(obra.totalExecutado ?? 0) / Number(obra.totalGeral)) * 100)}%
                    </p>
                    <p className="text-sm text-muted-foreground">Progresso</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">
                      {formatNumber(Number(obra.totalGeral))}
                    </p>
                    <p className="text-sm text-muted-foreground">Total m²</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Torres e Pavimentos */}
            <Card>
              <CardHeader>
                <CardTitle>Torres e Pavimentos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {obra.torres.map((torre, index) => (
                  <Card key={torre.id} className="border-l-4 border-l-blue-500">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center justify-between">
                        <span>{torre.nome}</span>
                        <Badge variant="secondary">
                          {torre.pavimentos.length} pavimento(s)
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {torre.pavimentos.length > 0 ? (
                        <div className="space-y-2">
                          {torre.pavimentos.map((pavimento) => (
                            <div key={pavimento.id} className="grid grid-cols-2 md:grid-cols-5 gap-2 p-3 bg-gray-50 rounded-lg text-sm">
                              <div>
                                <p className="font-medium">{pavimento.identificador}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Área</p>
                                <p className="font-medium">{formatNumber(Number(pavimento.areaM2))} m²</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Argamassa</p>
                                <p className="font-medium">{formatNumber(Number(pavimento.argamassaM3))} m³</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Espessura</p>
                                <p className="font-medium">{formatNumber(Number(pavimento.espessuraCM))} cm</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Progresso</p>
                                <p className="font-medium">{formatNumber(Number(pavimento.percentualExecutado))}%</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground italic">Nenhum pavimento cadastrado</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
} 