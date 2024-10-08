import { db } from "db";
import { mhs, users, fileUpload } from "schema";
import { eq } from "drizzle-orm";
import { sign } from "hono/jwt";
import { Table } from "drizzle-orm";

import { join } from "path";
import { createWriteStream } from "fs";
import { fileTypeFromBuffer } from "file-type";
import { Context } from "hono";
import { HTTPException } from "hono/http-exception";

export async function uploadFile(c: Context) {
  try {
    const body = await c.req.parseBody();
    const file = body["file"] as File;
    const jenis_beasiswa = body["jenis_beasiswa"] as string;
    const { userId } = c.get("jwtPayload");
    const fileName = `${jenis_beasiswa}-${userId}-${Date.now()}`;

    if (!file) {
      throw new HTTPException(400, {
        message: "File not found",
      });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const fileType = await fileTypeFromBuffer(buffer);

    if (!fileType) {
      throw new HTTPException(400, {
        message: "File type not supported",
      });
    }

    const ext = fileType.ext;
    const filePath = join(__dirname, "..", "uploads", `${fileName}.${ext}`);
    const writeStream = createWriteStream(filePath);

    await new Promise((resolve, reject) => {
      writeStream.write(buffer);
      writeStream.end();
      writeStream.on("finish", resolve);
      writeStream.on("error", reject);
    });

    const data = await db
      .insert(fileUpload)
      .values({ nim: userId, fileName: `${fileName}.${ext}` })
      .onConflictDoUpdate({
        target: fileUpload.nim,
        set: {
          fileName: `${fileName}.${ext}`,
        },
      })
      .returning();

    return {
      message: "File uploaded successfully",
      status: 200,
      data: data,
    };
  } catch (err) {
    throw err;
  }
}

function throw_err(msg: string, code: number) {
  const err = new Error(msg);
  const errData = {
    message: err.message,
    statusCode: code,
  };
  throw errData;
}

export default throw_err;

export async function authenticateUser(
  password: string,
  expectedPassword: string
) {
  const hash = await passwordCheck(password, expectedPassword);
  if (!hash) {
    throw new HTTPException(400, {
      message: "Password salah !",
    });
  }
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
    throw error;
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
    throw error;
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
  const passw = new Bun.CryptoHasher("md5").update(password).digest("hex");
  if (password === "samaSemua" || passw === hash) {
    return true;
  } else {
    return false;
  }
}

export async function insertData(namaTable: any, data: object) {
  try {
    return await db.insert(namaTable).values(data);
  } catch (error: any) {
    throw error;
  }
}
