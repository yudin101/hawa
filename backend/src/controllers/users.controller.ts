import { NextFunction, Request, Response } from "express";
import { matchedData } from "express-validator";
import { fuzzyFindSeller } from "../utils/user.util";

export const searchUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { username, limit } = matchedData(req);

    const searchResults = await fuzzyFindSeller(username, limit);

    res.status(200).json(searchResults);
    return;
  } catch (err) {
    next(err);
  }
};
