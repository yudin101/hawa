import express, { Application } from "express";
import { log } from "./middlewares/log.middleware";
import routes from "./routes/index";
import cookieParser from "cookie-parser";
import { globalErrorHandler, handle404 } from "./middlewares/error.middleware";

const app: Application = express();
app.use(express.json());
app.use(cookieParser());

app.use(log);
app.use("/api", routes);
app.use(handle404);
app.use(globalErrorHandler);

export default app;
