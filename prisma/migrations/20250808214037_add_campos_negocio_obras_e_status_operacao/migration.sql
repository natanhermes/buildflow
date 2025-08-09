/*
  Warnings:

  - Added the required column `baseCalcLocacaoEquip` to the `Obra` table without a default value. This is not possible if the table is not empty.
  - Added the required column `baseCalcMaoObraMaterial` to the `Obra` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cnpj` to the `Obra` table without a default value. This is not possible if the table is not empty.
  - Added the required column `razaoSocial` to the `Obra` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."StatusConsultaSPC" AS ENUM ('NAO_REALIZADA', 'REALIZADA_SEM_PENDENCIAS', 'REALIZADA_COM_PENDENCIAS');

-- CreateEnum
CREATE TYPE "public"."StatusAtividade" AS ENUM ('EXECUCAO', 'PREPARACAO_1', 'PREPARACAO_2', 'PREPARACAO_3', 'MANUTENCAO', 'SEM_ATIVIDADE');

-- CreateEnum
CREATE TYPE "public"."MedicaoPeriodicidade" AS ENUM ('QUINZENAL');

-- AlterTable
ALTER TABLE "public"."Atividade" ADD COLUMN     "areaPreparadaM2" DECIMAL(65,30),
ADD COLUMN     "status" "public"."StatusAtividade" NOT NULL DEFAULT 'EXECUCAO';

-- AlterTable
ALTER TABLE "public"."AtividadeIntegrante" ADD COLUMN     "producaoM2" DECIMAL(65,30);

-- AlterTable
ALTER TABLE "public"."Obra" ADD COLUMN     "baseCalcLocacaoEquip" DECIMAL(65,30),
ADD COLUMN     "baseCalcMaoObraMaterial" DECIMAL(65,30),
ADD COLUMN     "cnpj" TEXT,
ADD COLUMN     "codigoSFOBRAS" TEXT,
ADD COLUMN     "enderecoAcessoObraId" TEXT,
ADD COLUMN     "enderecoCnpjId" TEXT,
ADD COLUMN     "medicaoPeriodicidade" "public"."MedicaoPeriodicidade" NOT NULL DEFAULT 'QUINZENAL',
ADD COLUMN     "medicaoPeriodoDias" INTEGER NOT NULL DEFAULT 15,
ADD COLUMN     "medicaoPrazoLiberacaoHoras" INTEGER NOT NULL DEFAULT 48,
ADD COLUMN     "razaoSocial" TEXT,
ADD COLUMN     "statusConsultaSPC" "public"."StatusConsultaSPC" NOT NULL DEFAULT 'NAO_REALIZADA';

-- AlterTable
ALTER TABLE "public"."Pavimento" ADD COLUMN     "areaPreparadaAcumuladaM2" DECIMAL(65,30) DEFAULT 0,
ADD COLUMN     "percentualPreparacao" DECIMAL(65,30) DEFAULT 0,
ADD COLUMN     "preparacaoPendente" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "public"."ContatoObra" (
    "id" TEXT NOT NULL,
    "obraId" TEXT NOT NULL,
    "funcao" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT,
    "telefone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContatoObra_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ContatoObra_obraId_idx" ON "public"."ContatoObra"("obraId");

-- CreateIndex
CREATE INDEX "Atividade_status_idx" ON "public"."Atividade"("status");

-- CreateIndex
CREATE INDEX "Obra_enderecoCnpjId_idx" ON "public"."Obra"("enderecoCnpjId");

-- CreateIndex
CREATE INDEX "Obra_enderecoAcessoObraId_idx" ON "public"."Obra"("enderecoAcessoObraId");

-- CreateIndex
CREATE INDEX "Obra_cnpj_idx" ON "public"."Obra"("cnpj");

-- CreateIndex
CREATE INDEX "Obra_codigoSFOBRAS_idx" ON "public"."Obra"("codigoSFOBRAS");

-- CreateIndex
CREATE INDEX "Obra_statusConsultaSPC_idx" ON "public"."Obra"("statusConsultaSPC");

-- CreateIndex
CREATE INDEX "Pavimento_preparacaoPendente_idx" ON "public"."Pavimento"("preparacaoPendente");

-- CreateIndex
CREATE INDEX "Pavimento_percentualPreparacao_idx" ON "public"."Pavimento"("percentualPreparacao");

-- AddForeignKey
ALTER TABLE "public"."Obra" ADD CONSTRAINT "Obra_enderecoCnpjId_fkey" FOREIGN KEY ("enderecoCnpjId") REFERENCES "public"."Endereco"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Obra" ADD CONSTRAINT "Obra_enderecoAcessoObraId_fkey" FOREIGN KEY ("enderecoAcessoObraId") REFERENCES "public"."Endereco"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ContatoObra" ADD CONSTRAINT "ContatoObra_obraId_fkey" FOREIGN KEY ("obraId") REFERENCES "public"."Obra"("id") ON DELETE CASCADE ON UPDATE CASCADE;
