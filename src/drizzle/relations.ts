import { relations } from "drizzle-orm";
import { fakultas } from "./schema2";
import { prodi } from "./schema";

export const fakultasRelations = relations(fakultas, ({ many }) => ({
  prodi: many(prodi, {
    relationName: "fakultas",
  }),
}));

export const prodiRelations = relations(prodi, ({ one }) => ({
  fakultas: one(fakultas, {
    fields: [prodi.kode_fakultas],
    references: [fakultas.kode_fakultas],
  }),
}));
