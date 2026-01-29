import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync.util";
import { matchedData } from "express-validator";
import {
  findOrder,
  findOrdersWithItems,
  findSellerItems,
  changeOrderStatus,
  findMissingProducts,
  checkStock,
  findTotalPrice,
  createOrder,
} from "../services/order.service";
import { ROLES } from "../constants/roles";
import { findAddress } from "../services/address.service";
import { OSTATUS } from "../constants/orderStatus";

export const getOrders = catchAsync(async (req: Request, res: Response) => {
  const currentUserId = req.user!.id;
  const currentUserRoleId = req.user!.roleId;

  const { userId: requestUserId, limit, page } = matchedData(req);

  let targetUserId = currentUserId;
  if (currentUserRoleId === ROLES.ADMIN) {
    targetUserId = requestUserId;
  }

  const result = await findOrdersWithItems(targetUserId, limit, page);

  res.status(200).json(result);
  return;
});

export const getSellerOrders = catchAsync(
  async (req: Request, res: Response) => {
    const currentUserId = req.user!.id;

    const { limit, page } = matchedData(req);

    const result = await findSellerItems(currentUserId, limit, page);

    res.status(200).json(result)
    return;
  },
);

export const placeOrder = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const { orderItems, paymentMethod, deliveryAddressId } = matchedData(req);
  const { missingIds, products } = await findMissingProducts(orderItems);

  if (missingIds.length > 0) {
    res
      .status(404)
      .json({ error: "Product Not Found", missingIds: missingIds });
    return;
  }

  const insufficientProducts = await checkStock(orderItems, products);

  if (insufficientProducts.length > 0) {
    res.status(409).json({
      error: "Insufficient Stock",
      insufficientProducts: insufficientProducts,
    });
    return;
  }

  const totalPrice = findTotalPrice(orderItems, products);

  const deliveryAddress = await findAddress("id", {
    addressId: deliveryAddressId,
  });

  if (!deliveryAddress) {
    res.status(404).json({ error: "Address Not Found" });
    return;
  }

  const order = await createOrder({
    userId,
    status: OSTATUS.PENDING,
    totalPrice,
    deliveryAddressId,
    paymentMethod,
    products,
    orderItems,
  });

  res.status(200).json({ message: "Order Placed", order: order });
  return;
});

export const cancelOrder = catchAsync(async (req: Request, res: Response) => {
  const currentUserId = req.user!.id;
  const currentUserRoleId = req.user!.roleId;

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

  if (order.status !== OSTATUS.PENDING) {
    res.status(409).json({ error: "Order cannot be cancelled" });
    return;
  }

  await changeOrderStatus(targetUserId, orderId, OSTATUS.CANCELLED);

  res.status(200).json({ message: "Order Cancelled" });
  return;
});
