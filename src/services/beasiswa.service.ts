import { db } from "db";
import { beasiswa } from "schema";
export class BeasiswaService {
  async registerBeasiswa(
    nim: string,
    jenisBeasiswaId: number,
    detailJenis: number,
    urlFile: string
  ) {
    try {
      const registrasi = await db
        .insert(beasiswa)
        .values({
          nim,
          jenisBeasiswaId,
          detailJenis,
          urlFile,
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
