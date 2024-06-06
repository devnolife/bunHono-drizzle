import { Hono } from "hono";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import routes from "./routes/index";
import { HTTPException } from "hono/http-exception";

const app = new Hono();

app.use(cors());
app.use(logger());

app.notFound((c) => {
  return c.text("Not Found", 404);
});
app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return c.json(
      {
        status: err.status,
        message: err.message,
      },
      err.status
    );
  }
  return c.json(err.message, 500);
});

app.get("/", async (c) => {
  return c.text("This backend from devnolife");
});

app.route("/api", routes);

export { app };
