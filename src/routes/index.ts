import { Auth } from "../controller/auth.controller";
import { Hono } from "hono";
import { Middleware } from "../middleware/auth";
import { UserControllers } from "../controller/users.controller";
import { BeasiswaControllers } from "../controller/beasiswa.controller";
import { AdminControllers } from "../controller/admin.controller";
const routes = new Hono();
const auth = new Auth();

const middleware = new Middleware();
const user = new UserControllers();
const beasiswa = new BeasiswaControllers();
const admin = new AdminControllers();

routes.post("/login", async (c) => {
  const { username, password } = await c.req.json();
  return c.json(await auth.login(username, password));
});

routes.get("/user/check-register", middleware.isAuth, async (c) => {
  const { userId } = c.get("jwtPayload");
  return c.json(await auth.checkRegister(userId));
});
routes.get("/user/profile", middleware.isAuth, async (c) => {
  const profile = await user.profile(c);
  return c.json(profile);
});

routes.post("/user/nilai-raport", middleware.isAuth, async (c) => {
  return c.json(await user.addRaport(c));
});

routes.get("/user/nilai-raport", middleware.isAuth, async (c) => {
  return c.json(await user.nilaiRaport(c));
});

routes.put("/user/nilai-raport", middleware.isAuth, async (c) => {
  return c.json(await user.editRaport(c));
});

routes.delete("/user/nilai-raport/:idRaport", middleware.isAuth, async (c) => {
  return c.json(await user.deleteRaport(c));
});

routes.post("/user/beasiswa/register", middleware.isAuth, async (c) => {
  return c.json(await beasiswa.register(c));
});
routes.post("/user/beasiswa/upload", middleware.isAuth, async (c) => {
  return c.json(await user.uploadFile(c));
});
routes.put("/users/update-register", middleware.isAuth, async (c) => {
  return c.json(await user.updateRegister(c));
});

routes.get("/admin/mahasiswa", async (c) => {
  return c.json(await admin.getAllMahasiswa());
});

routes.get("/admin/dashboard", async (c) => {
  return c.json(await admin.dataDashboard());
});

routes.put("/admin/beasiswa/nilai", async (c) => {
  return c.json(await admin.updateBeasiswaNilai(c));
});

routes.get("/admin/file/:fileName", async (c) => {
  return await admin.getFile(c);
});

routes.get("/admin/dashboard", async (c) => {
  return c.json(await admin.dataDashboard());
});

routes.get("/admin/rekap-mahasiswa", async (c) => {
  return c.json(await admin.rekapMahasiswa());
});

routes.get("/admin/rekap-beasiswa", async (c) => {
  return c.json(await admin.rekapBeasiswa());
});

routes.get("/admin/rekap-beasiswa-name", async (c) => {
  return c.json(await admin.rekapByName());
});
export default routes;
