import { Schema } from "express-validator";
import {
  searchUserSchema,
  updateUserSchema,
} from "./user.validator";
import { addCategorySchema, updateCategorySchema } from "./category.validator";
import { loginSchema } from "./auth.validator";

export const searchProductSchema: Schema = {
  searchTerm: {
    in: ["query"],
    optional: true,
    isString: {
      errorMessage: "Search term must be a string",
    },
    trim: true,
    isLength: {
      options: { min: 2, max: 100 },
      errorMessage: "Search term must be between 2 and 100 characters",
    },
  },
  page: {
    ...searchUserSchema.page,
  },
  limit: {
    ...searchUserSchema.limit,
  },
};

export const getProductSchema: Schema = {
  id: {
    in: ["params"],
    trim: true,
    isInt: {
      errorMessage: "Product ID must be a integer",
    },
  },
};

export const getSellerProductSchema: Schema = {
  username: {
    ...searchUserSchema.username,
    in: ["params"],
  },
  page: {
    ...searchUserSchema.page,
  },
  limit: {
    ...searchUserSchema.limit,
  },
};

export const getCategoryProductSchema: Schema = {
  category: {
    ...addCategorySchema.category,
    in: ["params"],
  },
  page: {
    ...searchUserSchema.page,
  },
  limit: {
    ...searchUserSchema.limit,
  },
};

export const addProductSchema: Schema = {
  name: {
    in: ["body"],
    isString: {
      errorMessage: "Product name must be a string",
    },
    trim: true,
    isLength: {
      options: { max: 100 },
      errorMessage: "Product name cannot be longer than 1000 characters",
    },
  },
  pictureUrl: {
    in: ["body"],
    isString: {
      errorMessage: "Product Image URL must be a string",
    },
    trim: true,
    isLength: {
      options: {
        min: 10,
        max: 2048,
      },
      errorMessage: "Product Image URL must be between 10 and 2048 characters",
    },
  },
  body: {
    in: ["body"],
    isString: {
      errorMessage: "Product description body must be a string",
    },
    trim: true,
    isLength: {
      options: { min: 20, max: 5000 },
      errorMessage:
        "Product description must be between 20 and 5000 characters",
    },
  },
  categoryId: {
    ...updateCategorySchema.id,
  },
  sellerId: {
    ...updateUserSchema.id,
  },
  availableUnits: {
    in: ["body"],
    trim: true,
    isInt: {
      options: {
        min: 0,
        max: 999999,
      },
      errorMessage: "Available Units must be between 0 and 999,999",
    },
  },
  price: {
    in: ["body"],
    isFloat: {
      options: {
        min: 1,
        max: 999999.99,
      },
      errorMessage: "Product price must be between 1 and 999999.99",
    },
  },
};

export const updateProductSchema: Schema = {
  id: {
    ...getProductSchema.id,
    in: ["body"],
  },
  confirmationPassword: {
    ...loginSchema.password,
  },
  name: {
    ...addProductSchema.name,
    optional: true,
  },
  pictureUrl: {
    ...addProductSchema.pictureUrl,
    optional: true,
  },
  body: {
    ...addProductSchema.body,
    optional: true,
  },
  categoryId: {
    ...addProductSchema.categoryId,
    optional: true,
  },
  sellerId: {
    ...addProductSchema.sellerId,
    optional: true,
  },
  availableUnits: {
    ...addProductSchema.availableUnits,
    optional: true,
  },
  price: {
    ...addProductSchema.price,
    optional: true,
  },
};

export const deleteProductSchema: Schema = {
  id: {
    ...updateProductSchema.id,
  },
  confirmationPassword: {
    ...loginSchema.password,
  },
};
