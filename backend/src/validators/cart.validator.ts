import { Schema } from "express-validator";

export const addToCartSchema: Schema = {
  productId: {
    in: ["body"],
    trim: true,
    isInt: {
      errorMessage: "Product ID must be an integer",
    },
  },
  quantity: {
    in: ["body"],
    trim: true,
    isInt: {
      options: {
        min: 1,
        max: 99,
      },
      errorMessage: "Quantity must be an integer between 1 and 99",
    },
  },
};

export const deleteFromCartSchema: Schema = {
  productId: {
    ...addToCartSchema.productId,
  },
};
