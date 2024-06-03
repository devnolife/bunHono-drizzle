import { checkUsers } from "api";
import { users } from "schema";
import { passwordCheck, check, singJwt, insertData } from "utils";

export class AuthController {
  async login(username: string, password: string) {
    try {
      const checkUsersLocal = await check(username, users);
      if (checkUsersLocal !== null) {
        const checkPass = await passwordCheck(password, checkUsersLocal.passwd);
        if (checkPass !== null) {
          return {
            status: 200,
            message: "Login Success",
            data: {
              token: await singJwt(checkUsersLocal.id),
            },
          };
        }
      }
      const user = await checkUsers(username);
      await passwordCheck(password, user.passwd);
      await insertData(users, {
        username: user.nim,
        password: user.passwd,
        role: "users",
      });
      return {
        status: 200,
        message: "Login Success",
        data: {
          token: await singJwt(user.id),
        },
      };
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}
