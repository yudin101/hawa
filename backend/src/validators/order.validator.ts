import { Schema } from "express-validator";
import { searchUserSchema, updateUserSchema } from "./user.validator";
import { ProductRequestItem } from "../types/order";

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

export const placeOrderSchema: Schema = {
  orderItems: {
    in: ["body"],
    isArray: {
      options: { min: 1 },
      errorMessage: "Order Items must be a non-empty array",
    },
    custom: {
      options: (value) => {
        const ids = value.map((item: ProductRequestItem) => item.productId);
        const uniqueIds = new Set(ids);

        if (ids.length !== uniqueIds.size) {
          throw new Error("Each product in the order must be unique");
        }

        return true;
      },
    },
  },
  "orderItems.*.productId": {
    trim: true,
    isInt: {
      errorMessage: "Product ID must be an integer",
    },
  },
  "orderItems.*.quantity": {
    trim: true,
    isInt: {
      options: {
        min: 1,
        max: 99,
      },
      errorMessage: "Quantity must be an integer between 1 and 99",
    },
  },
  paymentMethod: {
    in: ["body"],
    isString: {
      errorMessage: "Payment Method must be a string",
    },
    trim: true,
    toUpperCase: true,
    isIn: {
      options: [["CASH", "ONLINE"]],
      errorMessage: "Allowed Methods: Cash or Online",
    },
  },
  deliveryAddressId: {
    in: ["body"],
    trim: true,
    isInt: {
      errorMessage: "Delivery Address ID must be an integer",
    },
  },
};

export const setOrderStatusSchema: Schema = {
  orderId: {
    in: ["body"],
    trim: true,
    isInt: {
      errorMessage: "Order ID must be an integer",
    },
  },
  userId: {
    ...updateUserSchema.id,
  },
};
