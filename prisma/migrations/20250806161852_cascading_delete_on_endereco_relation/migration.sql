-- DropForeignKey
ALTER TABLE "public"."Obra" DROP CONSTRAINT "Obra_enderecoId_fkey";

-- AddForeignKey
ALTER TABLE "public"."Obra" ADD CONSTRAINT "Obra_enderecoId_fkey" FOREIGN KEY ("enderecoId") REFERENCES "public"."Endereco"("id") ON DELETE CASCADE ON UPDATE CASCADE;
