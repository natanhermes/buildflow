-- CreateIndex
CREATE INDEX "Atividade_usuarioId_idx" ON "public"."Atividade"("usuarioId");

-- CreateIndex
CREATE INDEX "Atividade_obraId_idx" ON "public"."Atividade"("obraId");

-- CreateIndex
CREATE INDEX "Atividade_pavimentoId_idx" ON "public"."Atividade"("pavimentoId");

-- CreateIndex
CREATE INDEX "Atividade_obraId_usuarioId_idx" ON "public"."Atividade"("obraId", "usuarioId");

-- CreateIndex
CREATE INDEX "Atividade_obraId_createdAt_idx" ON "public"."Atividade"("obraId", "createdAt");

-- CreateIndex
CREATE INDEX "Atividade_usuarioId_createdAt_idx" ON "public"."Atividade"("usuarioId", "createdAt");

-- CreateIndex
CREATE INDEX "Atividade_execucao_idx" ON "public"."Atividade"("execucao");

-- CreateIndex
CREATE INDEX "Atividade_inicioExpediente_idx" ON "public"."Atividade"("inicioExpediente");

-- CreateIndex
CREATE INDEX "AtividadeIntegrante_atividadeId_idx" ON "public"."AtividadeIntegrante"("atividadeId");

-- CreateIndex
CREATE INDEX "AtividadeIntegrante_integranteId_idx" ON "public"."AtividadeIntegrante"("integranteId");

-- CreateIndex
CREATE INDEX "Endereco_cidade_estado_idx" ON "public"."Endereco"("cidade", "estado");

-- CreateIndex
CREATE INDEX "Endereco_bairro_idx" ON "public"."Endereco"("bairro");

-- CreateIndex
CREATE INDEX "Integrante_nome_idx" ON "public"."Integrante"("nome");

-- CreateIndex
CREATE INDEX "Obra_enderecoId_idx" ON "public"."Obra"("enderecoId");

-- CreateIndex
CREATE INDEX "Obra_criadoPorId_idx" ON "public"."Obra"("criadoPorId");

-- CreateIndex
CREATE INDEX "Obra_nome_idx" ON "public"."Obra"("nome");

-- CreateIndex
CREATE INDEX "Obra_construtora_idx" ON "public"."Obra"("construtora");

-- CreateIndex
CREATE INDEX "Obra_dataInicio_dataFim_idx" ON "public"."Obra"("dataInicio", "dataFim");

-- CreateIndex
CREATE INDEX "Obra_criadoPorId_dataInicio_idx" ON "public"."Obra"("criadoPorId", "dataInicio");

-- CreateIndex
CREATE INDEX "Pavimento_torreId_idx" ON "public"."Pavimento"("torreId");

-- CreateIndex
CREATE INDEX "Pavimento_torreId_identificador_idx" ON "public"."Pavimento"("torreId", "identificador");

-- CreateIndex
CREATE INDEX "Pavimento_dataExecucao_idx" ON "public"."Pavimento"("dataExecucao");

-- CreateIndex
CREATE INDEX "Pavimento_percentualExecutado_idx" ON "public"."Pavimento"("percentualExecutado");

-- CreateIndex
CREATE INDEX "Torre_obraId_idx" ON "public"."Torre"("obraId");

-- CreateIndex
CREATE INDEX "Torre_obraId_nome_idx" ON "public"."Torre"("obraId", "nome");

-- CreateIndex
CREATE INDEX "Usuario_status_idx" ON "public"."Usuario"("status");

-- CreateIndex
CREATE INDEX "Usuario_role_idx" ON "public"."Usuario"("role");

-- CreateIndex
CREATE INDEX "Usuario_nome_sobrenome_idx" ON "public"."Usuario"("nome", "sobrenome");
