import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  text,
  date,
  smallint,
  integer,
  unique,
  boolean,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  username: varchar("username", { length: 20 }).notNull(),
  password: varchar("password", { length: 150 }).notNull(),
  role: varchar("role", { length: 10 }).notNull(),
  created_at: timestamp("created_at", { mode: "string" }).defaultNow(),
  updated_at: timestamp("updated_at", { mode: "string" }).defaultNow(),
});

export const mhs = pgTable("mahasiswa", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  nim: varchar("nim", { length: 15 }).unique().notNull(),
  nama: varchar("nama", { length: 100 }),
  email: varchar("email", { length: 50 }),
  prodi: varchar("prodi", { length: 200 }),
  created_at: timestamp("created_at", { mode: "string" }),
  updated_at: timestamp("updated_at", { mode: "string" }),
  tempatLahir: varchar("tempatLahir", { length: 50 }),
  tanggalLahir: date("tanggalLahir", { mode: "string" }),
  jenisKelamin: varchar("jenisKelamin", { length: 10 }),
  hp: varchar("hp", { length: 15 }),
  isRegistered: boolean("is_registered").default(false),
  kodeProdi: varchar("kodeProdi", { length: 10 }),
});

export const beasiswa = pgTable("beasiswa", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  nim: varchar("nim", { length: 15 }).unique().notNull(),
  jenisBeasiswaId: smallint("jenis_biasiswa_id").notNull(),
  detailJenis: smallint("detail_jenis"),
  nilaiHasil: integer("nilai_hasil").default(0),
  nilaiDokument: integer("nilai_dokumen").default(0),
});

export const fakultas = pgTable("fakultas", {
  id: integer("id").primaryKey().notNull(),
  status: varchar("status", { length: 10 }).notNull(),
  kodeFakultas: varchar("kode_fakultas", { length: 20 }).notNull(),
  namaFakultas: varchar("nama_fakultas", { length: 50 }),
  namaFakultasEng: varchar("nama_fakultas_eng", { length: 50 }),
  namaAlias: varchar("nama_alias", { length: 20 }),
  program: varchar("program", { length: 100 }),
});

export const prodi = pgTable("prodi", {
  id: integer("id").primaryKey().notNull(),
  status: varchar("status", { length: 50 }),
  kodeFakultas: varchar("kode_fakultas", { length: 50 }),
  kodeProdi: varchar("kode_prodi", { length: 50 }),
  namaProdi: varchar("nama_prodi", { length: 255 }),
  namaProdiEng: varchar("nama_prodi_eng", { length: 255 }),
  pmbKuota: integer("pmb_kuota"),
  sksLulus: integer("sks_lulus"),
  statusProdi: varchar("status_prodi", { length: 50 }),
  emailProdi: varchar("email_prodi", { length: 255 }),
  nidnKetuaProdi: varchar("nidn_ketua_prodi", { length: 50 }),
  totalSksLulus: integer("total_sks_lulus"),
});

export const jenisBeasiswa = pgTable("jenis_beasiswa", {
  id: smallint("id").primaryKey().notNull(),
  nama: varchar("nama", { length: 50 }),
  detailJenis: smallint("detail_jenis"),
});

export const nilaiRaport = pgTable(
  "nilai_raport",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    mapel: varchar("mapel", { length: 50 }).notNull(),
    nim: varchar("nim", { length: 15 }).notNull(),
    semester1: varchar("semester1", { length: 10 }).default("0"),
    semester2: varchar("semester2", { length: 10 }).default("0"),
    semester3: varchar("semester3", { length: 10 }).default("0"),
    semester4: varchar("semester4", { length: 10 }).default("0"),
    semester5: varchar("semester5", { length: 10 }).default("0"),
  },
  (t) => ({
    unq: unique("raport_unq").on(t.nim, t.mapel),
  })
);

export const fileUpload = pgTable("file_upload", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  nim: varchar("nim", { length: 15 }).notNull().unique(),
  fileName: text("url"),
});

export const beasiswaRelations = relations(beasiswa, ({ one, many }) => ({
  jenisBeasiswa: one(jenisBeasiswa, {
    fields: [beasiswa.jenisBeasiswaId],
    references: [jenisBeasiswa.id],
  }),
  mahasiswa: one(mhs, {
    fields: [beasiswa.nim],
    references: [mhs.nim],
  }),
  nilaiRaport: many(nilaiRaport),
  fileUpload: one(fileUpload, {
    fields: [beasiswa.nim],
    references: [fileUpload.nim],
  }),
}));

export const nilaiRaportRelations = relations(nilaiRaport, ({ one }) => ({
  beasiswa: one(beasiswa, {
    fields: [nilaiRaport.nim],
    references: [beasiswa.nim],
  }),
}));

export const mahasiswaRelations = relations(mhs, ({ one }) => ({
  beasiswa: one(beasiswa, {
    fields: [mhs.nim],
    references: [beasiswa.nim],
  }),
}));
export const fileUploadRelations = relations(beasiswa, ({ one }) => ({
  fileopload: one(fileUpload, {
    fields: [beasiswa.nim],
    references: [fileUpload.nim],
  }),
}));
