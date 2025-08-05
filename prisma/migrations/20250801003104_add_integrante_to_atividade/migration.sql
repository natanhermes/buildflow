/*
  Warnings:

  - Added the required column `integranteId` to the `Atividade` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Atividade" ADD COLUMN     "integranteId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Atividade" ADD CONSTRAINT "Atividade_integranteId_fkey" FOREIGN KEY ("integranteId") REFERENCES "public"."Integrante"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
