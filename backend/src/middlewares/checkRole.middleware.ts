import { Request, Response, NextFunction } from "express";

export const checkRole = (roleId: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required." });
    }

    if (req.user.roleId === roleId) {
      next();
    } else {
      return res
        .status(403)
        .json({ error: "Forbidden: Insufficient privileges." });
    }
  };
};
