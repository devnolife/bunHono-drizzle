// services/admin.service.ts
import { db } from "db";
import { beasiswa, fileUpload, nilaiRaport } from "schema";
import { eq } from "drizzle-orm";
import { join } from "path";
import { readFile } from "fs/promises";

export class AdminService {
  async getFileUpload(fileName: string) {
    try {
      if (!fileName) {
        throw new Error("File name must be provided");
      }
      const filePath = join(__dirname, "..", "uploads", fileName);
      const fileContent = await readFile(filePath);
      return new Response(fileContent, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename=${fileName}`,
        },
      });
    } catch (error: any) {
      console.error("Error fetching file:", error);
      throw error;
    }
  }
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
              mahasiswa: true,
              fileUpload: true,
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
