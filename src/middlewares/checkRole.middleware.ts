import { Request, Response, NextFunction } from "express";

export const checkRole = (firstRoleId: string, secondRoleId?: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const currentUserId = req.user.roleId;

    if (currentUserId === firstRoleId || currentUserId === secondRoleId) {
      next();
    } else {
      return res.status(403).json({ error: "Insufficient privileges" });
    }
  };
};
