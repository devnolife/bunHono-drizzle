// services/admin.service.ts
import { db } from "db";
import { eq, sql } from "drizzle-orm";
import { join } from "path";
import { readFile } from "fs/promises";
import { beasiswa, fakultas, mhs, fileUpload, prodi, jenisBeasiswa } from "schema";


type Rekap = {
  kode_prodi: string | null;
  nim: string | null;
  nama: string | null;
  sudah_upload: boolean;
  jenis_beasiswa_id: number;
  detail_jenis: number | null;
};

export class AdminService {
  async rekapMahasiswa() {
    try {
      const result = await db
        .select({
          kodeFakultas: fakultas.kodeFakultas,
          namaFakultas: fakultas.namaFakultas,
          jumlah: sql`COUNT(*)`,
          sudahUpload: sql`SUM(CASE WHEN ${fileUpload.id} IS NOT NULL THEN 1 ELSE 0 END)`,
          prestasiAkademik: sql`SUM(CASE WHEN ${beasiswa.jenisBeasiswaId} = 1 THEN 1 ELSE 0 END)`,
          prestasiAkademik1: sql`SUM(CASE WHEN ${beasiswa.jenisBeasiswaId} = 1 AND ${beasiswa.detailJenis} = 1 THEN 1 ELSE 0 END)`,
          prestasiAkademik2: sql`SUM(CASE WHEN ${beasiswa.jenisBeasiswaId} = 1 AND ${beasiswa.detailJenis} = 2 THEN 1 ELSE 0 END)`,
          prestasiAkademik3: sql`SUM(CASE WHEN ${beasiswa.jenisBeasiswaId} = 1 AND ${beasiswa.detailJenis} = 3 THEN 1 ELSE 0 END)`,
          prestasiAkademik4: sql`SUM(CASE WHEN ${beasiswa.jenisBeasiswaId} = 1 AND ${beasiswa.detailJenis} = 4 THEN 1 ELSE 0 END)`,
          prestasiHafiz: sql`SUM(CASE WHEN ${beasiswa.jenisBeasiswaId} = 2 THEN 1 ELSE 0 END)`,
          prestasiHafiz1: sql`SUM(CASE WHEN ${beasiswa.jenisBeasiswaId} = 2 AND ${beasiswa.detailJenis} = 1 THEN 1 ELSE 0 END)`,
          prestasiHafiz2: sql`SUM(CASE WHEN ${beasiswa.jenisBeasiswaId} = 2 AND ${beasiswa.detailJenis} = 2 THEN 1 ELSE 0 END)`,
          prestasiHafiz3: sql`SUM(CASE WHEN ${beasiswa.jenisBeasiswaId} = 2 AND ${beasiswa.detailJenis} = 3 THEN 1 ELSE 0 END)`,
          prestasiHafiz4: sql`SUM(CASE WHEN ${beasiswa.jenisBeasiswaId} = 2 AND ${beasiswa.detailJenis} = 4 THEN 1 ELSE 0 END)`,
        })
        .from(mhs)
        .leftJoin(beasiswa, sql`${mhs.nim} = ${beasiswa.nim}`)
        .leftJoin(fileUpload, sql`${mhs.nim} = ${fileUpload.nim}`)
        .leftJoin(prodi, sql`${mhs.kodeProdi} = ${prodi.kodeProdi}`)
        .leftJoin(fakultas, sql`${prodi.kodeFakultas} = ${fakultas.kodeFakultas}`)
        .groupBy(fakultas.kodeFakultas, fakultas.namaFakultas);
      return result;
    } catch (error: any) {
      throw error;
    }
  }


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
  async rekapBeasiswa() {
    try {

      const rekap: Rekap[] = await db
        .select({
          kode_prodi: mhs.kodeProdi,
          nim: mhs.nim,
          nama: mhs.nama,
          sudah_upload: sql<boolean>`CASE WHEN ${fileUpload.id} IS NOT NULL THEN 1 ELSE 0 END`.as('sudah_upload'),
          jenis_beasiswa_id: beasiswa.jenisBeasiswaId,
          detail_jenis: beasiswa.detailJenis,
        })
        .from(beasiswa)
        .leftJoin(mhs, eq(beasiswa.nim, mhs.nim))
        .leftJoin(fileUpload, eq(mhs.nim, fileUpload.nim))


      const result = await db
        .select({
          kode_fakultas: fakultas.kodeFakultas,
          nama_fakultas: fakultas.namaFakultas,
          jumlah: sql<number>`COUNT(*)`,
          sudah_upload: sql<number>`SUM(CASE WHEN rekap.sudah_upload = 1 THEN 1 ELSE 0 END)`,
          prestasi_akademik: sql<number>`SUM(CASE WHEN rekap.jenis_beasiswa_id = 1 THEN 1 ELSE 0 END)`,
          prestasi_akademik_1: sql<number>`SUM(CASE WHEN rekap.jenis_beasiswa_id = 1 AND rekap.detail_jenis = 1 THEN 1 ELSE 0 END)`,
          prestasi_akademik_2: sql<number>`SUM(CASE WHEN sub.jenis_beasiswa_id = 1 AND sub.detail_jenis = 2 THEN 1 ELSE 0 END)`,
          prestasi_akademik_3: sql<number>`SUM(CASE WHEN sub.jenis_beasiswa_id = 1 AND sub.detail_jenis = 3 THEN 1 ELSE 0 END)`,
          prestasi_akademik_4: sql<number>`SUM(CASE WHEN sub.jenis_beasiswa_id = 1 AND sub.detail_jenis = 4 THEN 1 ELSE 0 END)`,
          prestasi_hafiz: sql<number>`SUM(CASE WHEN sub.jenis_beasiswa_id = 2 THEN 1 ELSE 0 END)`,
          prestasi_hafiz_1: sql<number>`SUM(CASE WHEN sub.jenis_beasiswa_id = 2 AND sub.detail_jenis = 1 THEN 1 ELSE 0 END)`,
          prestasi_hafiz_2: sql<number>`SUM(CASE WHEN sub.jenis_beasiswa_id = 2 AND sub.detail_jenis = 2 THEN 1 ELSE 0 END)`,
          prestasi_hafiz_3: sql<number>`SUM(CASE WHEN sub.jenis_beasiswa_id = 2 AND sub.detail_jenis = 3 THEN 1 ELSE 0 END)`,
          prestasi_hafiz_4: sql<number>`SUM(CASE WHEN sub.jenis_beasiswa_id = 2 AND sub.detail_jenis = 4 THEN 1 ELSE 0 END)`,
        })
        .from(sql`(${rekap}) as sub`)
        .leftJoin(prodi, eq(sql`sub.kode_prodi`, prodi.kodeProdi))
        .leftJoin(fakultas, eq(prodi.kodeFakultas, fakultas.kodeFakultas))
        .groupBy(fakultas.kodeFakultas, fakultas.namaFakultas);

      return result;
    } catch (error: any) {
      throw error;
    }
  }

  async updateNilai(nim: string, nilaiRaport: any) {
    try {
      const result = await db
        .update(beasiswa)
        .set({ nilaiHasil: nilaiRaport })
        .where(eq(beasiswa.nim, nim));
      return result;
    } catch (error: any) {
      throw error;
    }
  }

  async updateNilaiDokument(nim: string, nilaiDokument: number) {
    try {
      const result = await db
        .update(beasiswa)
        .set({ nilaiDokument: nilaiDokument })
        .where(eq(beasiswa.nim, nim));
      return result;
    } catch (error: any) {
      throw error;
    }
  }

  async rekapBeasiswaByName() {
    try {
      const result = await db
        .select({
          fakultas: fakultas.namaFakultas,
          prodi: mhs.prodi,
          nim: mhs.nim,
          nama: mhs.nama,
          hp: mhs.hp,
          email: mhs.email,
          jenisBeasiswa: sql`
        CASE
          WHEN ${beasiswa.jenisBeasiswaId} = 1 THEN 'Prestasi Akademik'
          WHEN ${beasiswa.jenisBeasiswaId} = 2 THEN 'Hafidz Quran'
        END`.as('jenis_beasiswa'),
          detailJenis: sql`
        CASE
          WHEN ${beasiswa.detailJenis} = 1 THEN 'Kategori 1'
          WHEN ${beasiswa.detailJenis} = 2 THEN 'Kategori 2'
          WHEN ${beasiswa.detailJenis} = 3 THEN 'Kategori 3'
          WHEN ${beasiswa.detailJenis} = 4 THEN 'Kategori 4'
        END`.as('jenis_beasiswa'),
          file: sql`
        CASE
          WHEN ${fileUpload.id} IS NOT NULL THEN 'https://api.beasiswa.unismuh.ac.id/api/admin/file/' || ${fileUpload.id}
          ELSE 'N/A'
        END`.as('file')
        })
        .from(beasiswa)
        .leftJoin(mhs, sql`${beasiswa.nim} = ${mhs.nim}`)
        .leftJoin(fileUpload, sql`${mhs.nim} = ${fileUpload.nim}`)
        .leftJoin(prodi, sql`${mhs.kodeProdi} = ${prodi.kodeProdi}`)
        .leftJoin(fakultas, sql`${prodi.kodeFakultas} = ${fakultas.kodeFakultas}`)
        .orderBy(fakultas.kodeFakultas, prodi.kodeProdi);

      return result;
    } catch (error: any) {
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

  async dashboardAdmin() {
    try {
      const totalMahasiswa = await db
        .select({
          count: sql<number>`count(*)`.mapWith(Number),
        })
        .from(mhs);
      const groupedMahasiswa = await db
        .select({
          prodi: mhs.prodi,
          totalRegistrations: sql<number>`count(${mhs.id})`.mapWith(Number),
        })
        .from(mhs)
        .groupBy(mhs.prodi);

      const groupedByBeasiswa = await db
        .select({
          jenisBeasiswa: jenisBeasiswa.nama,
          totalRegistrations: sql<number>`count(${beasiswa.id})`.mapWith(
            Number
          ),
        })
        .from(beasiswa)
        .innerJoin(
          jenisBeasiswa,
          sql`${beasiswa.jenisBeasiswaId} = ${jenisBeasiswa.id}`
        )
        .groupBy(jenisBeasiswa.nama);

      return {
        totalMahasiswa,
        groupedMahasiswa,
        groupedByBeasiswa,
      };
    } catch (error: any) {
      throw error;
    }
  }
}
