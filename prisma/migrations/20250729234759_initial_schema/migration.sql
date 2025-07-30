-- CreateTable
CREATE TABLE "public"."Usuario" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "sobrenome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Obra" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "cei" TEXT NOT NULL,
    "endereco" TEXT NOT NULL,
    "valorM2" DECIMAL(65,30) NOT NULL,
    "dataInicio" TIMESTAMP(3) NOT NULL,
    "dataFim" TIMESTAMP(3) NOT NULL,
    "totalGeral" DECIMAL(65,30) NOT NULL,
    "totalExecutado" DECIMAL(65,30) NOT NULL,
    "totalPendente" DECIMAL(65,30) NOT NULL,
    "criadoPorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Obra_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Torre" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "obraId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Torre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Pavimento" (
    "id" TEXT NOT NULL,
    "identificador" TEXT NOT NULL,
    "dataExecucao" TIMESTAMP(3) NOT NULL,
    "areaExecutadaM2" DECIMAL(65,30) NOT NULL,
    "areaM2" DECIMAL(65,30) NOT NULL,
    "percentualExecutado" DECIMAL(65,30) NOT NULL,
    "argamassaM3" DECIMAL(65,30) NOT NULL,
    "espessuraCM" DECIMAL(65,30) NOT NULL,
    "obs" TEXT,
    "torreId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pavimento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Integrante" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "equipeId" TEXT NOT NULL,

    CONSTRAINT "Integrante_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Equipe" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "obraId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Equipe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Atividade" (
    "id" TEXT NOT NULL,
    "aditivoM3" DECIMAL(65,30),
    "aditivoL" DECIMAL(65,30),
    "saldoAcumuladoM2" DECIMAL(65,30),
    "percentualSaldoAcumulado" DECIMAL(65,30),
    "execucao" TEXT,
    "inicioExpediente" TIMESTAMP(3),
    "inicioAlmoco" TIMESTAMP(3),
    "fimAlmoco" TIMESTAMP(3),
    "fimExpediente" TIMESTAMP(3),
    "obsExecucao" TEXT,
    "obsPonto" TEXT,
    "obsQtdBetoneira" TEXT,
    "obsHOI" TEXT,
    "equipeId" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "obraId" TEXT NOT NULL,
    "pavimentoId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Atividade_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "public"."Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Obra_cei_key" ON "public"."Obra"("cei");

-- AddForeignKey
ALTER TABLE "public"."Obra" ADD CONSTRAINT "Obra_criadoPorId_fkey" FOREIGN KEY ("criadoPorId") REFERENCES "public"."Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Torre" ADD CONSTRAINT "Torre_obraId_fkey" FOREIGN KEY ("obraId") REFERENCES "public"."Obra"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Pavimento" ADD CONSTRAINT "Pavimento_torreId_fkey" FOREIGN KEY ("torreId") REFERENCES "public"."Torre"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Integrante" ADD CONSTRAINT "Integrante_equipeId_fkey" FOREIGN KEY ("equipeId") REFERENCES "public"."Equipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Equipe" ADD CONSTRAINT "Equipe_obraId_fkey" FOREIGN KEY ("obraId") REFERENCES "public"."Obra"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Atividade" ADD CONSTRAINT "Atividade_equipeId_fkey" FOREIGN KEY ("equipeId") REFERENCES "public"."Equipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Atividade" ADD CONSTRAINT "Atividade_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "public"."Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Atividade" ADD CONSTRAINT "Atividade_obraId_fkey" FOREIGN KEY ("obraId") REFERENCES "public"."Obra"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Atividade" ADD CONSTRAINT "Atividade_pavimentoId_fkey" FOREIGN KEY ("pavimentoId") REFERENCES "public"."Pavimento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
