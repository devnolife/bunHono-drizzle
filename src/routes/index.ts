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

routes.get("/user/profile", middleware.isAuth, async (c) => {
  return c.json(await user.profile(c));
});

routes.get("user/nilai-raport", middleware.isAuth, async (c) => {
  return c.json(await user.nilaiRaport(c));
});

routes.post("/user/beasiswa/register", middleware.isAuth, async (c) => {
  return c.json(await beasiswa.register(c));
});

routes.get("/admin/mahasiswa", middleware.isAuth, async (c) => {
  return c.json(await admin.getAllMahasiswa());
});

routes.put("/admin/beasiswa/nilai", middleware.isAuth, async (c) => {
  return c.json(await admin.updateBeasiswaNilai(c));
});
routes.onError(async (c: any) => {
  return c.json({ status: 400, message: c.error.message });
});
export default routes;
