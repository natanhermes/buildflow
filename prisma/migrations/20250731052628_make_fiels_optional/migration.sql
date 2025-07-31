-- AlterTable
ALTER TABLE "public"."Obra" ALTER COLUMN "totalExecutado" DROP NOT NULL,
ALTER COLUMN "totalPendente" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."Pavimento" ALTER COLUMN "dataExecucao" DROP NOT NULL,
ALTER COLUMN "areaExecutadaM2" DROP NOT NULL,
ALTER COLUMN "percentualExecutado" DROP NOT NULL,
ALTER COLUMN "espessuraCM" DROP NOT NULL;
