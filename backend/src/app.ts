import express, { Application, Request, Response, NextFunction } from "express";
import { log } from "./middlewares/log.middleware";
import routes from "./routes/index";
import cookieParser from "cookie-parser";

const app: Application = express();
app.use(express.json());
app.use(cookieParser());

app.use(log);
app.use("/api", routes);

app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: "Internal Sever Error" });
  return;
});

export default app;
