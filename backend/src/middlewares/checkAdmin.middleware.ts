import { Request, Response, NextFunction } from "express";
import { ROLES } from "../constants/roles";

export const checkAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ error: "Authentication required." });
  }

  if (req.user.role === ROLES.ADMIN) {
    next();
  } else {
    return res
      .status(403)
      .json({ error: "Forbidden: Insufficient privileges." });
  }
};
