import { pgTable, varchar, serial } from "drizzle-orm/pg-core";

export const fakultas = pgTable("fakultas", {
  id: serial("id").primaryKey().notNull(),
  nama: varchar("nama", { length: 50 }).notNull(),
  kode_fakultas: varchar("kode_fakultas", { length: 10 }).notNull(),
});
