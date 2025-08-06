/*
  Warnings:

  - You are about to drop the column `integranteId` on the `Atividade` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Atividade" DROP CONSTRAINT "Atividade_integranteId_fkey";

-- AlterTable
ALTER TABLE "public"."Atividade" DROP COLUMN "integranteId";

-- CreateTable
CREATE TABLE "public"."AtividadeIntegrante" (
    "id" TEXT NOT NULL,
    "atividadeId" TEXT NOT NULL,
    "integranteId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AtividadeIntegrante_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AtividadeIntegrante_atividadeId_integranteId_key" ON "public"."AtividadeIntegrante"("atividadeId", "integranteId");

-- AddForeignKey
ALTER TABLE "public"."AtividadeIntegrante" ADD CONSTRAINT "AtividadeIntegrante_atividadeId_fkey" FOREIGN KEY ("atividadeId") REFERENCES "public"."Atividade"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AtividadeIntegrante" ADD CONSTRAINT "AtividadeIntegrante_integranteId_fkey" FOREIGN KEY ("integranteId") REFERENCES "public"."Integrante"("id") ON DELETE CASCADE ON UPDATE CASCADE;
