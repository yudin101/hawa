import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

export const validate = (req: Request, res: Response, next: NextFunction) => {
  const valResult = validationResult(req);

  if (!valResult.isEmpty()) {
    res.status(400).json({ error: valResult.array() });
    return;
  }

  next();
};
