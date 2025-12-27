import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import env from "../config/env";
import { User } from "../types/user";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers["authorization"];
    const accessToken = authHeader && authHeader?.split(" ")[1];

    if (accessToken === undefined) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    jwt.verify(accessToken, env.JWT_SECRET, (err, user) => {
      if (err) {
        res.status(403).json({ error: "Forbidden" });
        return;
      }

      req.user = user as User;
      next();
    });
  } catch (err) {
    next(err);
  }
};
