/*
  Warnings:

  - Added the required column `construtora` to the `Obra` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Obra" ADD COLUMN     "construtora" TEXT NOT NULL;
