import { Schema } from "express-validator";
import { searchAddressSchema } from "./address.validator";
import { searchUserSchema } from "./user.validator";
import { loginSchema } from "./auth.validator";

export const searchCategorySchema: Schema = {
  searchTerm: {
    ...searchAddressSchema.searchTerm,
  },
  page: {
    ...searchUserSchema.page,
  },
  limit: {
    ...searchUserSchema.limit,
  },
};

export const addCategorySchema: Schema = {
  category: {
    in: ["body"],
    isString: {
      errorMessage: "Category must be a string",
    },
    trim: true,
    isLength: {
      options: {
        min: 2,
        max: 50,
      },
      errorMessage: "Category must be between 2 and 50 characters",
    },
    toUpperCase: true,
  },
};

export const updateCategorySchema: Schema = {
  category: {
    ...addCategorySchema.category,
  },
  confirmationPassword: {
    ...loginSchema.password,
  },
  id: {
    in: ["body"],
    trim: true,
    isInt: {
      errorMessage: "Category ID must be a integer",
    },
  },
};

export const deleteCategorySchema: Schema = {
  confirmationPassword: {
    ...loginSchema.password,
  },
  id: {
    ...updateCategorySchema.id,
  },
};
