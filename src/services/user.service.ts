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
      throw new Error(error.message);
    }
  }
  async getNilaiRaport(userNim: string) {
    try {
      const nilai = await db.query.nilaiRaport.findMany({
        where: eq(nilaiRaport.nim, userNim),
      });

      const subjectAverages: { [key: string]: number } = {};
      const subjectCounts: { [key: string]: number } = {};

      // Iterate through the fetched data
      nilai.forEach((item: any) => {
        const { mapel, semester1, semester2, semester3, semester4 } = item;
        const scores = [semester1, semester2, semester3, semester4].map(Number);

        const validScores = scores.filter((score) => score !== 0);

        if (validScores.length > 0) {
          const total = validScores.reduce((sum, score) => sum + score, 0);
          const average = total / validScores.length;

          if (!subjectAverages[mapel]) {
            subjectAverages[mapel] = 0;
            subjectCounts[mapel] = 0;
          }
          subjectAverages[mapel] += total;
          subjectCounts[mapel] += validScores.length;
        }
      });
      const finalAverages = Object.keys(subjectAverages).map((mapel) => ({
        mapel,
        average: subjectAverages[mapel] / subjectCounts[mapel],
      }));

      console.log(nilai);
      console.log(finalAverages);

      return {
        status: 200,
        message: "Success",
        data: {
          nilai,
          averages: finalAverages,
        },
      };
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}
