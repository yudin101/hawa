import { Schema } from "express-validator";
import { searchUserSchema } from "./user.validator";

export const getOrdersSchema: Schema = {
  limit: {
    ...searchUserSchema.limit,
  },
  page: {
    ...searchUserSchema.page,
  },
};
