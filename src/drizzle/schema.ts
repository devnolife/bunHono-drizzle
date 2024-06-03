import { pgTable, uuid, varchar, timestamp, text } from "drizzle-orm/pg-core";
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
  nim: varchar("nim", { length: 15 }),
  nama: varchar("nama", { length: 100 }),
  prodi: varchar("prodi", { length: 20 }),
  created_at: timestamp("created_at", { mode: "string" }),
  updated_at: timestamp("updated_at", { mode: "string" }),
  tempatLahir: varchar("tempatLahir", { length: 50 }),
  tanggalLahir: timestamp("tanggalLahir", { mode: "string" }),
  jenisKelamin: varchar("jenisKelamin", { length: 10 }),
  hp: varchar("hp", { length: 15 }),
  kodeProdi: varchar("kodeProdi", { length: 10 }),
});

export const beasiswa = pgTable("beasiswa", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  nim: varchar("nim", { length: 15 }),
  jenisBeasiswaId: uuid("jenisBeasiswa").notNull(),
  nilaiRaportId: uuid("nilaiRaport").notNull(),
  urlFile: text("urlFile"),
});

export const jenisBeasiswa = pgTable("jenis_beasiswa", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  nama: varchar("nama", { length: 50 }),
});

export const nilaiRaport = pgTable("nilai_raport", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  mapel: varchar("mapel", { length: 50 }),
  semester1: varchar("semester1", { length: 10 }),
  semester2: varchar("semester2", { length: 10 }),
  semester3: varchar("semester3", { length: 10 }),
  semester4: varchar("semester4", { length: 10 }),
});

export const beasiswaRelations = relations(beasiswa, ({ one }) => ({
  jenisBeasiswa: one(jenisBeasiswa, {
    fields: [beasiswa.jenisBeasiswaId],
    references: [jenisBeasiswa.id],
  }),
  nilaiRaport: one(nilaiRaport, {
    fields: [beasiswa.nilaiRaportId],
    references: [nilaiRaport.id],
  }),
  mahasiswa: one(mhs, {
    fields: [beasiswa.nim],
    references: [mhs.nim],
  }),
}));

export const mahasiswaRelations = relations(mhs, ({ one }) => ({
  beasiswa: one(beasiswa, {
    fields: [mhs.nim],
    references: [beasiswa.nim],
  }),
}));
