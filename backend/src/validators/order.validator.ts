import { Schema } from "express-validator";
import { searchUserSchema, updateUserSchema } from "./user.validator";

export const getOrdersSchema: Schema = {
  limit: {
    ...searchUserSchema.limit,
  },
  page: {
    ...searchUserSchema.page,
  },
  userId: {
    ...updateUserSchema.id,
  },
};

export const cancelOrderSchema: Schema = {
  orderId: {
    in: ["body"],
    isInt: {
      errorMessage: "Order ID must be an integer",
    },
    trim: true,
  },
  userId: {
    ...updateUserSchema.id,
  },
};
