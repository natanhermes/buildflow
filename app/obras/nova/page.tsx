"use client"

import { useActionState, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { createObraAction } from "../actions"
import { TorresForm } from "./torres-form"
import { withMask } from 'use-mask-input'
import { useCep } from "@/hooks/use-cep"
import { obraSchema, type ObraFormData } from "@/lib/validations/obra"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

interface Torre {
  id: string
  nome: string
  pavimentos: Pavimento[]
}

interface Pavimento {
  id: string
  identificador: string
  areaM2: number
  argamassaM3: number
}

export default function NovaObraPage() {
  const [torres, setTorres] = useState<Torre[]>([])
  const [cep, setCep] = useState("")
  const [cepCnpj, setCepCnpj] = useState("")
  const [cepAcesso, setCepAcesso] = useState("")
  const [state, formAction, isPending] = useActionState(createObraAction, {})
  const form = useForm<ObraFormData>({
    resolver: zodResolver(obraSchema),
    defaultValues: {
      nome: "",
      cei: "",
      construtora: "",
      dataInicio: "",
      dataFim: "",
    } as any
  })

  const { data: cepData, isLoading: isLoadingCep, error: cepError } = useCep(cep)
  const { data: cepCnpjData, isLoading: isLoadingCepCnpj } = useCep(cepCnpj)
  const { data: cepAcessoData, isLoading: isLoadingCepAcesso } = useCep(cepAcesso)

  const handleTorresChange = (novasTorres: Torre[]) => {
    setTorres(novasTorres)
  }

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "")
    const formattedCep = value.replace(/(\d{5})(\d{3})/, "$1-$2")
    setCep(formattedCep)
  }

  const handleCepCnpjChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "")
    const formattedCep = value.replace(/(\d{5})(\d{3})/, "$1-$2")
    setCepCnpj(formattedCep)
  }

  // Estado paralelo removido; RHF é a fonte de verdade

  const handleCepAcessoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "")
    const formattedCep = value.replace(/(\d{5})(\d{3})/, "$1-$2")
    setCepAcesso(formattedCep)
  }

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/obras">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Link>
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">Nova Obra</h2>
        </div>
      </div>

      {state.error && (
        <div className="p-4 text-sm text-red-500 bg-red-50 border border-red-200 rounded">
          {state.error}
        </div>
      )}

      <Form {...form}>
      <form action={formAction} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informações Básicas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="nome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome da Obra</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o nome da obra" {...field} />
                    </FormControl>
                    <FormMessage />
                    {state.fieldErrors?.nome && (
                      <p className="text-sm text-red-500">{state.fieldErrors.nome[0]}</p>
                    )}
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cei"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CEI</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="99.999.99999/99"
                        {...field}
                        ref={(el) => {
                          field.ref(el)
                          const applyMask = withMask('99.999.99999/99')
                          if (el) applyMask(el)
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                    {state.fieldErrors?.cei && (
                      <p className="text-sm text-red-500">{state.fieldErrors.cei[0]}</p>
                    )}
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="valorM2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor por m²</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0.00" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                    {state.fieldErrors?.valorM2 && (
                      <p className="text-sm text-red-500">{state.fieldErrors.valorM2[0]}</p>
                    )}
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dataInicio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Início</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                    {state.fieldErrors?.dataInicio && (
                      <p className="text-sm text-red-500">{state.fieldErrors.dataInicio[0]}</p>
                    )}
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dataFim"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Fim</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                    {state.fieldErrors?.dataFim && (
                      <p className="text-sm text-red-500">{state.fieldErrors.dataFim[0]}</p>
                    )}
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="construtora"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Construtora</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Digite o nome da construtora" {...field} />
                    </FormControl>
                    <FormMessage />
                    {state.fieldErrors?.construtora && (
                      <p className="text-sm text-red-500">{state.fieldErrors.construtora[0]}</p>
                    )}
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="razaoSocial">Razão Social</Label>
                <Input id="razaoSocial" placeholder="Razão Social" {...form.register('razaoSocial')} />
                {state.fieldErrors?.razaoSocial && (
                  <p className="text-sm text-red-500">{state.fieldErrors.razaoSocial[0]}</p>
                )}
              </div>
              <FormField
                control={form.control}
                name="cnpj"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CNPJ</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="00.000.000/0000-00"
                        {...field}
                        ref={(el) => {
                          field.ref(el)
                          const applyMask = withMask('99.999.999/9999-99')
                          if (el) applyMask(el)
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                    {state.fieldErrors?.cnpj && (
                      <p className="text-sm text-red-500">{state.fieldErrors.cnpj[0]}</p>
                    )}
                  </FormItem>
                )}
              />
              <div className="space-y-2">
                <Label htmlFor="codigoSFOBRAS">Código SFOBRAS</Label>
                <Input id="codigoSFOBRAS" placeholder="SF-000" {...form.register('codigoSFOBRAS')} />
                {state.fieldErrors?.codigoSFOBRAS && (
                  <p className="text-sm text-red-500">{state.fieldErrors.codigoSFOBRAS[0]}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="statusConsultaSPC">Status da Consulta SPC</Label>
                <select id="statusConsultaSPC" className="w-full border rounded h-10 px-3" defaultValue="NAO_REALIZADA" {...form.register('statusConsultaSPC')}>
                  <option value="NAO_REALIZADA">Não realizada</option>
                  <option value="REALIZADA_SEM_PENDENCIAS">Realizada sem pendências</option>
                  <option value="REALIZADA_COM_PENDENCIAS">Realizada com pendências</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="baseCalcMaoObraMaterial">% Mão de Obra e Material</Label>
                <Input id="baseCalcMaoObraMaterial" type="number" step="0.01" min="0" max="100" placeholder="0-100" {...form.register('baseCalcMaoObraMaterial')} />
                {state.fieldErrors?.baseCalcMaoObraMaterial && (
                  <p className="text-sm text-red-500">{state.fieldErrors.baseCalcMaoObraMaterial[0]}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="baseCalcLocacaoEquip">% Locação de Equipamentos</Label>
                <Input id="baseCalcLocacaoEquip" type="number" step="0.01" min="0" max="100" placeholder="0-100" {...form.register('baseCalcLocacaoEquip')} />
                {state.fieldErrors?.baseCalcLocacaoEquip && (
                  <p className="text-sm text-red-500">{state.fieldErrors.baseCalcLocacaoEquip[0]}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="medicaoPeriodoDias">Período de Medição (dias)</Label>
                <Input id="medicaoPeriodoDias" type="number" min="1" {...form.register('medicaoPeriodoDias')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="medicaoPrazoLiberacaoHoras">Prazo Máximo de Liberação (horas)</Label>
                <Input id="medicaoPrazoLiberacaoHoras" type="number" min="1" {...form.register('medicaoPrazoLiberacaoHoras')} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Endereço</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cep">CEP</Label>
                <div className="relative">
                  <Input
                    id="cep"
                    name="endereco.cep"
                    value={cep}
                    onChange={handleCepChange}
                    placeholder="00000-000"
                    maxLength={9}
                    required
                  />
                  {isLoadingCep && (
                    <Loader2 className="absolute right-2 top-2.5 h-4 w-4 animate-spin text-muted-foreground" />
                  )}
                </div>
                {cepError && (
                  <p className="text-sm text-red-500">CEP não encontrado</p>
                )}
                {state.fieldErrors?.["endereco.cep"] && (
                  <p className="text-sm text-red-500">{state.fieldErrors["endereco.cep"][0]}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="numero">Número</Label>
                <Input
                  id="numero"
                  name="endereco.numero"
                  disabled={!cep}
                  placeholder="123"
                  required
                />
                {state.fieldErrors?.["endereco.numero"] && (
                  <p className="text-sm text-red-500">{state.fieldErrors["endereco.numero"][0]}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="logradouro">Logradouro</Label>
                <Input
                  id="logradouro"
                  name="endereco.logradouro"
                  value={cepData?.logradouro || ""}
                  disabled={!cep}
                  onChange={() => {}} // Handler vazio para campos controlados
                  placeholder="Rua, Avenida, etc."
                  readOnly={!!cepData?.logradouro}
                  required
                />
                {state.fieldErrors?.["endereco.logradouro"] && (
                  <p className="text-sm text-red-500">{state.fieldErrors["endereco.logradouro"][0]}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="complemento">Complemento</Label>
                <Input
                  id="complemento"
                  name="endereco.complemento"
                  disabled={!cep}
                  placeholder="Apartamento, Bloco, etc."
                />
                {state.fieldErrors?.["endereco.complemento"] && (
                  <p className="text-sm text-red-500">{state.fieldErrors["endereco.complemento"][0]}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bairro">Bairro</Label>
                <Input
                  id="bairro"
                  name="endereco.bairro"
                  value={cepData?.bairro || ""}
                  disabled={!cep}
                  onChange={() => {}} // Handler vazio para campos controlados
                  placeholder="Bairro"
                  readOnly={!!cepData?.bairro}
                  required
                />
                {state.fieldErrors?.["endereco.bairro"] && (
                  <p className="text-sm text-red-500">{state.fieldErrors["endereco.bairro"][0]}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="cidade">Cidade</Label>
                <Input
                  id="cidade"
                  name="endereco.cidade"
                  disabled={!cep}
                  value={cepData?.localidade || ""}
                  onChange={() => {}} // Handler vazio para campos controlados
                  placeholder="Cidade"
                  readOnly={!!cepData?.localidade}
                  required
                />
                {state.fieldErrors?.["endereco.cidade"] && (
                  <p className="text-sm text-red-500">{state.fieldErrors["endereco.cidade"][0]}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="estado">Estado</Label>
                <Input
                  id="estado"
                  name="endereco.estado"
                  value={cepData?.uf || ""}
                  disabled={!cep}
                  onChange={() => {}} // Handler vazio para campos controlados
                  placeholder="UF"
                  readOnly={!!cepData?.uf}
                  required
                />
                {state.fieldErrors?.["endereco.estado"] && (
                  <p className="text-sm text-red-500">{state.fieldErrors["endereco.estado"][0]}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Endereço CNPJ (opcional)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="enderecoCnpj.cep">CEP</Label>
                <div className="relative">
                  <Input id="enderecoCnpj.cep" name="enderecoCnpj.cep" value={cepCnpj} onChange={handleCepCnpjChange} placeholder="00000-000" maxLength={9} />
                  {isLoadingCepCnpj && (
                    <Loader2 className="absolute right-2 top-2.5 h-4 w-4 animate-spin text-muted-foreground" />
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="enderecoCnpj.numero">Número</Label>
                <Input id="enderecoCnpj.numero" name="enderecoCnpj.numero" disabled={!cepCnpj} placeholder="123" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="enderecoCnpj.logradouro">Logradouro</Label>
                <Input id="enderecoCnpj.logradouro" name="enderecoCnpj.logradouro" value={cepCnpjData?.logradouro || ""} disabled={!cepCnpj} onChange={() => {}} placeholder="Rua, Avenida, etc." readOnly={!!cepCnpjData?.logradouro} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="enderecoCnpj.complemento">Complemento</Label>
                <Input id="enderecoCnpj.complemento" name="enderecoCnpj.complemento" disabled={!cepCnpj} placeholder="Apartamento, Bloco, etc." />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="enderecoCnpj.bairro">Bairro</Label>
                <Input id="enderecoCnpj.bairro" name="enderecoCnpj.bairro" value={cepCnpjData?.bairro || ""} disabled={!cepCnpj} onChange={() => {}} placeholder="Bairro" readOnly={!!cepCnpjData?.bairro} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="enderecoCnpj.cidade">Cidade</Label>
                <Input id="enderecoCnpj.cidade" name="enderecoCnpj.cidade" value={cepCnpjData?.localidade || ""} disabled={!cepCnpj} onChange={() => {}} placeholder="Cidade" readOnly={!!cepCnpjData?.localidade} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="enderecoCnpj.estado">Estado</Label>
                <Input id="enderecoCnpj.estado" name="enderecoCnpj.estado" value={cepCnpjData?.uf || ""} disabled={!cepCnpj} onChange={() => {}} placeholder="UF" readOnly={!!cepCnpjData?.uf} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Endereço de Acesso à Obra (opcional)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="enderecoAcessoObra.cep">CEP</Label>
                <div className="relative">
                  <Input id="enderecoAcessoObra.cep" name="enderecoAcessoObra.cep" value={cepAcesso} onChange={handleCepAcessoChange} placeholder="00000-000" maxLength={9} />
                  {isLoadingCepAcesso && (
                    <Loader2 className="absolute right-2 top-2.5 h-4 w-4 animate-spin text-muted-foreground" />
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="enderecoAcessoObra.numero">Número</Label>
                <Input id="enderecoAcessoObra.numero" name="enderecoAcessoObra.numero" disabled={!cepAcesso} placeholder="123" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="enderecoAcessoObra.logradouro">Logradouro</Label>
                <Input id="enderecoAcessoObra.logradouro" name="enderecoAcessoObra.logradouro" value={cepAcessoData?.logradouro || ""} disabled={!cepAcesso} onChange={() => {}} placeholder="Rua, Avenida, etc." readOnly={!!cepAcessoData?.logradouro} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="enderecoAcessoObra.complemento">Complemento</Label>
                <Input id="enderecoAcessoObra.complemento" name="enderecoAcessoObra.complemento" disabled={!cepAcesso} placeholder="Ponto de referência, etc." />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="enderecoAcessoObra.bairro">Bairro</Label>
                <Input id="enderecoAcessoObra.bairro" name="enderecoAcessoObra.bairro" value={cepAcessoData?.bairro || ""} disabled={!cepAcesso} onChange={() => {}} placeholder="Bairro" readOnly={!!cepAcessoData?.bairro} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="enderecoAcessoObra.cidade">Cidade</Label>
                <Input id="enderecoAcessoObra.cidade" name="enderecoAcessoObra.cidade" value={cepAcessoData?.localidade || ""} disabled={!cepAcesso} onChange={() => {}} placeholder="Cidade" readOnly={!!cepAcessoData?.localidade} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="enderecoAcessoObra.estado">Estado</Label>
                <Input id="enderecoAcessoObra.estado" name="enderecoAcessoObra.estado" value={cepAcessoData?.uf || ""} disabled={!cepAcesso} onChange={() => {}} placeholder="UF" readOnly={!!cepAcessoData?.uf} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contatos da Obra</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ContatosForm fieldErrors={state.fieldErrors} />
          </CardContent>
        </Card>

        <TorresForm
          torres={torres}
          onChange={handleTorresChange}
          errors={state.fieldErrors}
        />

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" asChild>
            <Link href="/obras">Cancelar</Link>
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Criando..." : "Criar Obra"}
          </Button>
        </div>
      </form>
      </Form>
    </div>
  )
}

function ContatosForm({ fieldErrors }: { fieldErrors?: Record<string, string[]> }) {
  const [rows, setRows] = useState<Array<{ id: number }>>([{ id: 0 }])
  const addRow = () => setRows((r) => [...r, { id: r.length }])
  const removeRow = (id: number) => setRows((r) => r.filter((x) => x.id !== id))
  return (
    <div className="space-y-3">
      {rows.map((row) => (
        <div key={row.id} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
          <div className="space-y-2">
            <Label htmlFor={`contatos.${row.id}.funcao`}>Função</Label>
            <Input id={`contatos.${row.id}.funcao`} name={`contatos.${row.id}.funcao`} placeholder="Ex.: Engenheiro" />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`contatos.${row.id}.nome`}>Nome</Label>
            <Input id={`contatos.${row.id}.nome`} name={`contatos.${row.id}.nome`} placeholder="Nome" />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`contatos.${row.id}.email`}>Email</Label>
            <Input id={`contatos.${row.id}.email`} name={`contatos.${row.id}.email`} placeholder="email@exemplo.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`contatos.${row.id}.telefone`}>Telefone</Label>
            <Input id={`contatos.${row.id}.telefone`} name={`contatos.${row.id}.telefone`} placeholder="+55DDDXXXXXXXXX" />
          </div>
          <div className="md:col-span-4 flex justify-end">
            <Button type="button" variant="outline" onClick={() => removeRow(row.id)}>Remover</Button>
          </div>
        </div>
      ))}
      <div className="flex justify-end">
        <Button type="button" variant="secondary" onClick={addRow}>Adicionar contato</Button>
      </div>
    </div>
  )
}
