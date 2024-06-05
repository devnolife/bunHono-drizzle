const url = "https://sicekcok.if.unismuh.ac.id/graphql";
const urlLocal = "http://10.10.2.54:3144/graphql";
export async function checkUsers(username: string) {
  try {
    const users = await fetch("https://sicekcok.if.unismuh.ac.id/graphql", {
      method: "POST",
      body: JSON.stringify({
        query: `query{ mahasiswaUser(nim: "${username}"){   nim,   nama,   prodi,   passwd }}`,
        variables: {},
      }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await users.json();
    if (data.data.mahasiswaUser === null) {
      throw new Error("Data tidak ditemukan");
    } else {
      return data.data.mahasiswaUser;
    }
  } catch (error: any) {
    console.log("🚀 ~ checkUsers ~ error:", error);
    throw new Error(error.message);
  }
}

export async function getProfile(username: string) {
  try {
    const profile = await fetch("https://sicekcok.if.unismuh.ac.id/graphql", {
      method: "POST",
      body: JSON.stringify({
        query: `query{ mahasiswa(nim: "${username}") { nama, email , tempatLahir, nim, kodeProdi, jenisKelamin, tempatLahir, tanggalLahir, hp }}`,
        variables: {},
      }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await profile.json();
    if (data.data.mahasiswaUser === null) {
      throw new Error("Data tidak ditemukan");
    } else {
      return data.data.mahasiswa;
    }
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function getNilaiRaport(username: string) {
  try {
    const nilai = await fetch("https://sicekcok.if.unismuh.ac.id/graphql", {
      method: "POST",
      body: JSON.stringify({
        query: `query{ mahasiswaNilaiRapor(nim: "${username}") { 
          mapel
          semester1
          semester2
          semester3
          semester4 }}`,
        variables: {},
      }),
      headers: { "Content-Type": "application/json" },
    });
    const {
      data: { mahasiswaNilaiRapor },
    } = await nilai.json();
    if (mahasiswaNilaiRapor === null) {
      throw new Error("Data tidak ditemukan");
    } else {
      return mahasiswaNilaiRapor;
    }
  } catch (error: any) {
    throw new Error(error?.message);
  }
}
