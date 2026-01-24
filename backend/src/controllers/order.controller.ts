import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync.util";
import { matchedData } from "express-validator";
import {
  findOrder,
  findOrdersWithItems,
  changeOrderStatus,
} from "../services/order.service";
import { ROLES } from "../constants/roles";

export const getOrders = catchAsync(async (req: Request, res: Response) => {
  const currentUserId = req.user?.id as string;
  const currentUserRoleId = req.user?.roleId as string;

  const { userId: requestUserId, limit, page } = matchedData(req);

  let targetUserId = currentUserId;
  if (currentUserRoleId === ROLES.ADMIN) {
    targetUserId = requestUserId;
  }

  const result = await findOrdersWithItems(targetUserId, limit, page);

  res.status(200).json(result);
  return;
});

export const placeOrder = catchAsync(async (req: Request, res: Response) => {
  const { } = matchedData(req);
});

export const cancelOrder = catchAsync(async (req: Request, res: Response) => {
  const currentUserId = req.user?.id as string;
  const currentUserRoleId = req.user?.roleId as string;

  const { userId: requestUserId, orderId } = matchedData(req);

  let targetUserId = currentUserId;
  if (currentUserRoleId === ROLES.ADMIN) {
    targetUserId = requestUserId;
  }

  const order = await findOrder(targetUserId, orderId);

  if (!order) {
    res.status(404).json({ error: "Order Not Found" });
    return;
  }

  if (order.status !== "pending") {
    res.status(409).json({ error: "Order cannot be cancelled" });
    return;
  }

  await changeOrderStatus(targetUserId, orderId, "cancelled");

  res.status(200).json({ message: "Order Cancelled" });
  return;
});
