import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import env from "../config/env";
import { RequestUser } from "../types/user";

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
        if (err.name === "TokenExpiredError") {
          res.status(401).json({ error: "Token Expired" });
          return;
        }
        res.status(401).json({ error: "Invalid Token" });
        return;
      }

      req.user = user as RequestUser;
      next();
    });
  } catch (err) {
    next(err);
  }
};
