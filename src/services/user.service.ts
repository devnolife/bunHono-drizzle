// services/user.service.ts
import { db } from "db";
import { eq } from "drizzle-orm";
import { mhs, nilaiRaport } from "schema";

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
        message: "Success",
        data: profile,
      };
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
        const { mapel, semester1, semester2, semester3, semester4 } = item;
        const scores = [semester1, semester2, semester3, semester4].map(Number);
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
        message: "Success",
        data: {
          nilai,
          averages: finalAverages,
        },
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
        return {
          status: 404,
          message: "Nilai raport not found",
        };
      }
      await db
        .update(nilaiRaport)
        .set({
          ...data,
        })
        .where(eq(nilaiRaport.id, idRaport));

      return {
        status: 200,
        message: "Success",
      };
    } catch (error: any) {
      throw error;
    }
  }
}
