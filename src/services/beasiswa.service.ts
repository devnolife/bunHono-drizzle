import { db } from "db";
import { beasiswa, nilaiRaport as nilaiRaportTable } from "schema"; // Adjust import as per your project structure

export class BeasiswaService {
  async registerBeasiswa(
    nim: string,
    jenisBeasiswaId: number,
    nilaiRaport: {
      mapel: string;
      semester1: string;
      semester2: string;
      semester3: string;
      semester4: string;
    }[],
    urlFile: string
  ) {
    try {
      const registrasi = await db
        .insert(beasiswa)
        .values({
          nim,
          jenisBeasiswaId,
          urlFile,
        })
        .returning();

      const nilai = await db
        .insert(nilaiRaportTable)
        .values(
          nilaiRaport.map((nilai) => ({
            nim,
            ...nilai,
            semester1: nilai.semester1,
            semester2: nilai.semester2,
            semester3: nilai.semester3,
            semester4: nilai.semester4,
          }))
        )
        .returning();
      return {
        registrasi,
        nilai,
      };
    } catch (e: any) {
      return e.message;
    }
  }
}
