import { Schema } from "express-validator";

export const searchUserValidation: Schema = {
  username: {
    in: ["query"],
    isString: true,
    trim: true,
    escape: true,
    notEmpty: {
      errorMessage: "Search term cannot be empty",
    },
  },
  limit: {
    in: ["query"],
    optional: true,
    isInt: { options: { min: 1, max: 100 } },
    toInt: true,
  },
};
