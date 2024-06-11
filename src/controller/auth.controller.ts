import { checkUsers, getProfile, getNilaiRaport } from "api";
import { db } from "db";
import { eq } from "drizzle-orm";
import { mhs, users, nilaiRaport as nilaiRaportTable } from "schema";
import { findUniqueUsers, singJwt, authenticateUser, insertData } from "utils";
export class Auth {
  async me(userId: string) {
    try {
      const user = await findUniqueUsers(userId, users);
      return {
        status: 200,
        message: "Success",
        data: {
          id: user.id,
          username: user.username,
          role: user.role,
        },
      };
    } catch (error: any) {
      throw error;
    }
  }

  async login(username: string, password: string) {
    try {
      if (username === "admin") {
        return await handleAdminLogin(username, password);
      } else {
        return await handleUserLogin(username, password);
      }
    } catch (error: any) {
      throw error;
    }
  }
  async checkRegister(userId: string) {
    console.log("🚀 ~ Auth ~ checkRegister ~ userId:", userId);
    try {
      const data = await db.query.mhs.findFirst({
        where: eq(mhs.nim, userId),
      });
      return {
        status: 200,
        message: "Success",
        data: {
          isRegistered: data?.isRegistered,
        },
      };
    } catch (error: any) {
      throw error;
    }
  }
}

async function handleAdminLogin(username: string, password: string) {
  const user = await findUniqueUsers(username, users);
  if (!user) {
    return {
      status: 404,
      message: "User not found",
    };
  }

  await authenticateUser(password, user.password);
  const token = await singJwt(user.id);
  return {
    status: 200,
    message: "Success",
    data: {
      id: user.id,
      username: user.username,
      role: "admin",
      token,
    },
  };
}

async function handleUserLogin(username: string, password: string) {
  const user = await checkUsers(username);
  console.log("🚀 ~ handleUserLogin ~ user:", user);
  await authenticateUser(password, user.passwd);
  const profile = await getProfile(user.nim);
  checkAndInsertUserProfile(user.nim, profile);
  checkAndInsertUserGrades(user.nim);
  const token = await singJwt(user.nim);

  return {
    status: 200,
    message: "Success",
    data: {
      id: user.nim,
      username: user.nim,
      nama: profile.nama,
      role: "users",
      token,
    },
  };
}

async function checkAndInsertUserProfile(nim: string, profile: any) {
  try {
    const criteria = eq(mhs.nim, nim);
    const existingProfile = await checkDataExists(mhs, criteria);
    if (!existingProfile) {
      await insertData(mhs, {
        nim: nim,
        nama: profile.nama,
        prodi: profile.prodi?.namaProdi,
        tempatLahir: profile.tempatLahir,
        tanggalLahir: new Date(profile.tanggalLahir),
        jenisKelamin: profile.jenisKelamin,
        hp: profile.hp,
        kodeProdi: profile.kodeProdi,
        email: profile.email,
      });
    }
  } catch (error: any) {
    throw error;
  }
}

async function checkAndInsertUserGrades(nim: string) {
  const raport = await getNilaiRaport(nim);
  const criteria = eq(nilaiRaportTable.nim, nim);
  const existingGrade = await checkDataExists(nilaiRaportTable, criteria);
  if (!existingGrade) {
    raport.map(async (nilai: any) => {
      await insertData(nilaiRaportTable, {
        mapel: nilai.mapel,
        nim: nim,
        semester1: nilai.semester1,
        semester2: nilai.semester2,
        semester3: nilai.semester3,
        semester4: nilai.semester4,
        semester5: nilai.semester5,
      });
    });
  }
}

async function checkDataExists(table: any, criteria: any) {
  try {
    const result = await db.select().from(table).where(criteria).limit(1);
    return result.length > 0;
  } catch (error) {
    throw error;
  }
}
