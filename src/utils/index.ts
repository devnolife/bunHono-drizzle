import { db } from "db";
import { users } from "schema";
import { eq } from "drizzle-orm";
import { sign } from "hono/jwt";

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

export async function check(username: string, namaTable: any) {
  try {
    const user = await (db.query as { [key: string]: any })[namaTable].findOne({
      where: eq(users.username, username),
    });
    return user ? user : null;
  } catch (error: any) {
    return error;
  }
}

export async function singJwt(userId: string) {
  const playload = {
    userId,
    exp: Math.floor(Date.now() / 1000) + 60 * 5,
  };
  return await sign(playload, "secretKey");
}

export async function passwordCheck(password: string, hash: string) {
  if (process.env.PRODUCTION === "false") {
    console.log("seharusnya sama semua");
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
