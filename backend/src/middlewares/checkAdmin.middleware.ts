import { Request, Response, NextFunction } from "express";
const ADMIN_ROLE_ID = "2"; // better implementation needed

export const checkAdmin = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.user) {
    return res.status(401).json({ error: "Authentication required." });
  }

  if (req.user.role === ADMIN_ROLE_ID) {
    next();
  } else {
    return res
      .status(403)
      .json({ error: "Forbidden: Insufficient privileges." });
  }
};
