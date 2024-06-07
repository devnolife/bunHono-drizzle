const url2 = "https://sicekcok.if.unismuh.ac.id/graphql";
const url = "http://10.10.2.54:3144/graphql";
import { HTTPException } from "hono/http-exception";
export async function checkUsers(username: string) {
  try {
    const users = await fetch(`${url}`, {
      method: "POST",
      body: JSON.stringify({
        query: `query{ mahasiswaUser(nim: "${username}"){   nim,   nama,   prodi,   passwd }}`,
        variables: {},
      }),
      headers: { "Content-Type": "application/json" },
    });
    const {
      data: { mahasiswaUser },
    } = await users.json();
    if (mahasiswaUser === null) {
      throw new HTTPException(400, {
        message: "Mahasiswa tidak ditemukan",
      });
    } else {
      return mahasiswaUser;
    }
  } catch (error: any) {
    throw error;
  }
}

export async function getProfile(username: string) {
  try {
    const profile = await fetch(`${url}`, {
      method: "POST",
      body: JSON.stringify({
        query: `query{ mahasiswa(nim: "${username}") { nama, email , tempatLahir, nim, kodeProdi, jenisKelamin, tempatLahir, tanggalLahir, hp, prodi{namaProdi} }}`,
        variables: {},
      }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await profile.json();
    if (data.data.mahasiswa === null) {
      throw new HTTPException(400, {
        message: "Data tidak ditemukan !",
      });
    } else {
      return data.data.mahasiswa;
    }
  } catch (error: any) {
    throw new error();
  }
}

export async function getNilaiRaport(username: string) {
  try {
    const nilai = await fetch(`${url}`, {
      method: "POST",
      body: JSON.stringify({
        query: `query{ mahasiswaNilaiRapor(nim: "${username}") { 
          mapel
          semester1
          semester2
          semester3
          semester4 
          semester5
          }}`,
        variables: {},
      }),
      headers: { "Content-Type": "application/json" },
    });
    const {
      data: { mahasiswaNilaiRapor },
    } = await nilai.json();
    if (mahasiswaNilaiRapor === null) {
      throw new HTTPException(400, {
        message: "Data tidak ditemukan !",
      });
    } else {
      return mahasiswaNilaiRapor;
    }
  } catch (error: any) {
    throw error;
  }
}
