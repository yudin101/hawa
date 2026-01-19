import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync.util";
import { findUser } from "../services/user.service";
import { findCart } from "../services/cart.service";

export const getCart = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id as string;

  if (!(await findUser("id", userId))) {
    res.status(404).json({ error: "User Not Found" });
    return;
  }

  const result = await findCart(userId);

  res.status(200).json(result);
  return;
});
