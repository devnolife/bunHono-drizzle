
import { db } from "db";
import { eq } from "drizzle-orm";
import { mhs, users } from "schema";
import { findUniqueUsers, singJwt, authenticateUser } from "utils";
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
        return {
          status: 200,
          message: "Maaf Pendaftaran Sudah Ditutup",
          data: null
        }
      }
    } catch (error: any) {
      throw error;
    }
  }
  async checkRegister(userId: string) {
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
  const user = await db.query.users.findFirst({
    where: eq(users.username, username),
  });
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
