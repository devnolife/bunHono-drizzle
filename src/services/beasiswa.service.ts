import { db } from "db";
import { beasiswa } from "schema";
export class BeasiswaService {
  async registerBeasiswa(
    nim: string,
    jenisBeasiswaId: number,
    detailJenis: number
  ) {
    try {
      const registrasi = await db
        .insert(beasiswa)
        .values({
          nim,
          jenisBeasiswaId,
          detailJenis,
        })
        .onConflictDoUpdate({
          target: beasiswa.nim,
          set: {
            jenisBeasiswaId,
            detailJenis,
          },
        })
        .returning();
      return {
        registrasi,
      };
    } catch (error: any) {
      throw error;
    }
  }
}
