// services/admin.service.ts
import { db } from "db";
import { beasiswa } from "schema";
import { eq } from "drizzle-orm";

export class AdminService {
  async getAllMahasiswa() {
    try {
      const students = await db.query.mhs.findMany({
        with: {
          beasiswa: {
            with: {
              jenisBeasiswa: {
                columns: {
                  nama: true,
                },
              },
              nilaiRaport: true,
            },
          },
        },
      });
      return {
        status: 200,
        message: "Success",
        data: students,
      };
    } catch (error: any) {
      throw error;
    }
  }

  async updateBeasiswaNilai(beasiswaId: string, newNilai: number) {
    try {
      await db
        .update(beasiswa)
        .set({ nilaiHasil: newNilai })
        .where(eq(beasiswa.id, beasiswaId));
      return {
        status: 200,
        message: "Beasiswa nilai updated successfully",
      };
    } catch (error: any) {
      throw error;
    }
  }
}
