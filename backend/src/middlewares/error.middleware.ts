import { Request, Response, NextFunction, Router } from "express";

const errorHandler = Router();

// 404 Handler
const handle404 = (req: Request, res: Response) => {
  res.status(404).json({
    error: `Route ${req.originalUrl} not found`,
  });
};

// Global Error Handler
const globalHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error(err);
  res.status(500).json({ error: "Internal Sever Error" });
  return;
};

errorHandler.use(handle404);
errorHandler.use(globalHandler);

export default errorHandler;
