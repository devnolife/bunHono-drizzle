// services/user.service.ts
import { db } from "db";
import { and, eq } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";
import { mhs, nilaiRaport, users } from "schema";

export class UserService {
  async getUserProfile(userId: string) {
    try {
      const profile = await db.query.mhs.findFirst({
        where: eq(mhs.nim, userId),
        with: {
          beasiswa: true,
        },
      });
      return {
        status: 200,
        message: "Sukses mendapatkan profil",
        data: profile,
      };
    } catch (error: any) {
      throw error;
    }
  }

  async updateRegister(userId: string) {
    try {
      await db
        .update(users)
        .set({
          isRegistered: true,
        })
        .where(eq(users.id, userId));
    } catch (error: any) {
      throw error;
    }
  }

  async getNilaiRaport(userNim: string) {
    try {
      const nilai = await db.query.nilaiRaport.findMany({
        where: eq(nilaiRaport.nim, userNim),
      });

      const subjectAverages: { [key: string]: number } = {};
      const subjectCounts: { [key: string]: number } = {};

      nilai.forEach((item: any) => {
        if (!subjectAverages[item.mapel]) {
          subjectAverages[item.mapel] = 0;
          subjectCounts[item.mapel] = 0;
        }
      });

      nilai.forEach((item: any) => {
        const { mapel, semester1, semester2, semester3, semester4, semester5 } =
          item;
        const scores = [
          semester1,
          semester2,
          semester3,
          semester4,
          semester5,
        ].map(Number);
        const validScores = scores.filter((score) => score !== 0);
        if (validScores.length > 0) {
          const total = validScores.reduce((sum, score) => sum + score, 0);
          subjectAverages[mapel] += total;
          subjectCounts[mapel] += validScores.length;
        }
      });
      const subjectAbbreviations: { [key: string]: string } = {
        "Pendidikan Agama dan Budi Pekerti": "PAI",
        "Pendidikan Pancasila dan Kewarganegaraan": "PKN",
        "Ilmu Pengetahuan Alam": "IPA",
        "Ilmu Pengetahuan Sosial": "IPS",
      };
      const finalAverages = Object.keys(subjectAverages).map((mapel) => {
        const average =
          subjectCounts[mapel] > 0
            ? subjectAverages[mapel] / subjectCounts[mapel]
            : 0;
        const abbreviation = subjectAbbreviations[mapel] || mapel;
        return {
          mapel: abbreviation,
          average,
        };
      });

      return {
        status: 200,
        message: "Sukses mendapatkan nilai raport",
        data: {
          nilai,
          averages: finalAverages,
        },
      };
    } catch (error: any) {
      throw error;
    }
  }

  async addNewMapel(userNim: string, data: any) {
    try {
      if (data?.mapel === undefined || data?.mapel === "") {
        throw new HTTPException(400, {
          message: "Mapel tidak boleh kosong",
        });
      }
      let namaMapel = data.mapel.replace(/\b\w/g, (l: any) => l.toUpperCase());
      const nilai = await db.query.nilaiRaport.findFirst({
        where: and(
          eq(nilaiRaport.mapel, namaMapel),
          eq(nilaiRaport.nim, userNim)
        ),
      });
      if (nilai) {
        throw new HTTPException(400, {
          message: "Mapel sudah ada",
        });
      }
      const newMapel = await db
        .insert(nilaiRaport)
        .values({
          nim: userNim,
          mapel: namaMapel,
          semester1: data?.semester1 || "0",
          semester2: data?.semester2 || "0",
          semester3: data?.semester3 || "0",
          semester4: data?.semester4 || "0",
          semester5: data?.semester5 || "0",
        })
        .returning();
      return {
        status: 200,
        message: "Sukses menambahkan mapel baru",
        data: newMapel,
      };
    } catch (error: any) {
      throw error;
    }
  }

  async updateNilaiRaport(idRaport: string, data: any) {
    try {
      const nilai = await db.query.nilaiRaport.findFirst({
        where: eq(nilaiRaport.id, idRaport),
      });
      if (!nilai) {
        throw new HTTPException(400, {
          message: "Nilai raport tidak ditemukan",
        });
      }
      await db
        .update(nilaiRaport)
        .set({
          ...data,
        })
        .where(eq(nilaiRaport.id, idRaport));

      return {
        status: 200,
        message: "Sukses mengubah nilai raport",
        data: null,
      };
    } catch (error: any) {
      throw error;
    }
  }

  async deteleNilaiRaport(idRaport: string) {
    try {
      const nilai = await db.query.nilaiRaport.findFirst({
        where: eq(nilaiRaport.id, idRaport),
      });
      if (!nilai) {
        throw new HTTPException(400, {
          message: "Nilai raport tidak ditemukan",
        });
      }
      await db.delete(nilaiRaport).where(eq(nilaiRaport.id, idRaport));
      return {
        status: 200,
        message: "Sukses menghapus nilai raport",
        data: null,
      };
    } catch (error: any) {
      throw error;
    }
  }
}
