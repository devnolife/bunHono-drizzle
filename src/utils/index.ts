import { db } from "db";
import { mhs, users } from "schema";
import { eq } from "drizzle-orm";
import { sign } from "hono/jwt";
import { Table } from "drizzle-orm";

export async function authenticateUser(
  password: string,
  expectedPassword: string
) {
  const checkPass = await passwordCheck(password, expectedPassword);
  if (!checkPass) {
    return {
      status: 401,
      message: "Wrong password",
    };
  }
  return null;
}

export async function findUnique(table: Table, conditions: any, select?: any) {
  try {
    const value = await db.select(select).from(table).where(conditions);
    return value;
  } catch (error: any) {
    throw error;
  }
}

export async function findUniqueUsers(username: string, namaTable: any) {
  try {
    const user = await (db.query as { [key: string]: any })[namaTable].findOne({
      where: eq(users.username, username),
    });
    return user ? user : null;
  } catch (error: any) {
    console.log("🚀 ~ findUniqueUsers ~ error:", error);
    return error;
  }
}

export async function findUniqueMahasiswa(nim: string, namaTable: any) {
  try {
    const mahasiswa = await (db.query as { [key: string]: any })[
      namaTable
    ].findOne({
      where: eq(mhs.nim, nim),
    });
    return mahasiswa ? mahasiswa : null;
  } catch (error: any) {
    return error;
  }
}

export async function singJwt(userId: string) {
  const playload = {
    userId,
    exp: Math.floor(Date.now() / 1000) + 60 * 10,
  };
  return await sign(playload, "secret");
}

export async function passwordCheck(password: string, hash: string) {
  if (process.env.PRODUCTION === "false") {
    if (password === "samaSemua") {
      return true;
    }
  } else {
    const passw = new Bun.CryptoHasher("md5").update(password).digest("hex");
    if (passw === hash) {
      return true;
    } else {
      return null;
    }
  }
}

export async function insertData(namaTable: any, data: object) {
  try {
    return await db.insert(namaTable).values(data);
  } catch (error: any) {
    return error;
  }
}
