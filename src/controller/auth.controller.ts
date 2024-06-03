import { checkUsers } from "api";
import { users } from "schema";
import { check, singJwt, authenticateUser } from "utils";
export class Auth {
  async me(userId: string) {
    try {
      const user = await check(userId, users);
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
      throw new Error(error.message);
    }
  }
  async login(username: string, password: string) {
    try {
      let user, token, authResult;
      if (username === "admin") {
        user = await check(username, users);
        if (!user) {
          return {
            status: 404,
            message: "User not found",
          };
        }
        authResult = await authenticateUser(password, user.password);
        if (authResult) return authResult;

        token = await singJwt(user.id);
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
      } else {
        user = await checkUsers(username);
        authResult = await authenticateUser(password, user.passwd);
        if (authResult) return authResult;
        token = await singJwt(user.nim);
        return {
          status: 200,
          message: "Success",
          data: {
            id: user.nim,
            username: user.nim,
            role: "users",
            token,
          },
        };
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}
