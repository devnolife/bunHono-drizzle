CREATE TABLE IF NOT EXISTS "beasiswa" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nim" varchar(15),
	"jenisBeasiswa" uuid NOT NULL,
	"nilaiRaport" uuid NOT NULL,
	"urlFile" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "jenis_beasiswa" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nama" varchar(50)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "nilai_raport" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"mapel" varchar(50),
	"semester1" varchar(10),
	"semester2" varchar(10),
	"semester3" varchar(10),
	"semester4" varchar(10)
);
