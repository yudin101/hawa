import { Schema } from "express-validator";

export const addToCartSchema: Schema = {
  productId: {
    in: ["body"],
    isInt: {
      errorMessage: "Product ID must be an integer",
    },
    trim: true,
  },
  quantity: {
    in: ["body"],
    isInt: {
      options: {
        min: 1,
        max: 99,
      },
      errorMessage: "Quantity must be an integer between 1 and 99",
    },
  },
};
