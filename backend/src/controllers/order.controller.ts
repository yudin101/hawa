import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync.util";
import { matchedData } from "express-validator";
import { findOrders } from "../services/order.service";

export const getOrders = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id as string;
  const { limit, page } = matchedData(req);

  const result = await findOrders(userId, limit, page);

  res.status(200).json(result);
  return;
});

export const placeOrder = catchAsync(async (req: Request, res: Response) => {
  const { } = matchedData(req);
});

export const cancelOrder = catchAsync(async (req: Request, res: Response) => {
  const { } = matchedData(req);
});
