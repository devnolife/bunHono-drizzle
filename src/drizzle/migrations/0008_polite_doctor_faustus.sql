ALTER TABLE "prodi" ADD COLUMN "kode_fakultas" varchar(10);--> statement-breakpoint
ALTER TABLE "prodi" DROP COLUMN IF EXISTS "fakultas_id";