/*
  Warnings:

  - You are about to drop the column `equipeId` on the `Atividade` table. All the data in the column will be lost.
  - You are about to drop the column `percentualSaldoAcumulado` on the `Atividade` table. All the data in the column will be lost.
  - The `execucao` column on the `Atividade` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `equipeId` on the `Integrante` table. All the data in the column will be lost.
  - You are about to drop the `Equipe` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[cpf]` on the table `Integrante` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cpf` to the `Integrante` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."Execucao" AS ENUM ('EXECUTADO', 'INICIAL', 'MEIO', 'FINAL');

-- DropForeignKey
ALTER TABLE "public"."Atividade" DROP CONSTRAINT "Atividade_equipeId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Equipe" DROP CONSTRAINT "Equipe_obraId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Integrante" DROP CONSTRAINT "Integrante_equipeId_fkey";

-- AlterTable
ALTER TABLE "public"."Atividade" DROP COLUMN "equipeId",
DROP COLUMN "percentualSaldoAcumulado",
DROP COLUMN "execucao",
ADD COLUMN     "execucao" "public"."Execucao";

-- AlterTable
ALTER TABLE "public"."Integrante" DROP COLUMN "equipeId",
ADD COLUMN     "cpf" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "public"."Equipe";

-- CreateIndex
CREATE UNIQUE INDEX "Integrante_cpf_key" ON "public"."Integrante"("cpf");
