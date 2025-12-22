import { Request, Response, NextFunction } from "express";
const ADMIN_ROLE_ID = 1;

export const checkAdmin = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required." });
  }

  if (req.user.roleId === ADMIN_ROLE_ID) {
    next();
  } else {
    return res
      .status(403)
      .json({ message: "Forbidden: Insufficient privileges." });
  }
};
