import { Request, Response, NextFunction } from "express";

// 404 Handler
export const handle404 = (req: Request, res: Response) => {
  res.status(404).json({
    error: `${req.method} - ${req.originalUrl} Not Found`,
  });
};

// Global Error Handler
export const globalErrorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error(err);
  res.status(500).json({ error: "Internal Sever Error" });
  return;
};
