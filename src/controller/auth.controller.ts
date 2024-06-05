import { checkUsers, getProfile, getNilaiRaport } from "api";
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
      throw new Error(error.message);
    }
  }
  async login(username: string, password: string) {
    try {
      let user: {
          password: string;
          id: string;
          username: any;
          passwd: string;
          nim: string;
        },
        token,
        authResult;
      if (username === "admin") {
        user = await findUniqueUsers(username, users);
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
        console.log("🚀 ~ Auth ~ login ~ user:", user);
        authResult = await authenticateUser(password, user.passwd);
        if (authResult) return authResult;
        const profile = await getProfile(user.nim);
        insertData(mhs, {
          nim: user.nim,
          nama: profile.nama,
          prodi: profile.prodi,
          tempatLahir: profile.tempatLahir,
          tanggalLahir: new Date(profile.tanggalLahir),
          jenisKelamin: profile.jenisKelamin,
          hp: profile.hp,
          kodeProdi: profile.kodeProdi,
        });
        const nilaiRaport = await getNilaiRaport(user.nim);
        nilaiRaport.forEach(
          (nilai: {
            mapel: any;
            semester1: any;
            semester2: any;
            semester3: any;
            semester4: any;
          }) => {
            insertData(nilaiRaportTable, {
              mapel: nilai.mapel,
              nim: user.nim,
              semester1: nilai.semester1,
              semester2: nilai.semester2,
              semester3: nilai.semester3,
              semester4: nilai.semester4,
            });
          }
        );
        token = await singJwt(user.nim);
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
    } catch (error: any) {
      console.log("🚀 ~ Auth ~ login ~ error:", error);
      throw new Error(error.message);
    }
  }
}
