import { Schema } from "express-validator";

const NEPALI_MOBILE_REGEX = /^(\+977)?9[6-9]\d{8}$/;

export const registerValidation: Schema = {
  username: {
    in: ["body"],
    trim: true,
    isString: {
      errorMessage: "Username must be a string",
    },
    isLength: {
      options: {
        max: 50,
      },
      errorMessage: "Username must be within 50 characters",
    },
  },
  email: {
    in: ["body"],
    trim: true,
    normalizeEmail: true,
    isString: {
      errorMessage: "Email must be a string",
    },
    isEmail: {
      errorMessage: "Invalid email format",
    },
    isLength: {
      options: {
        max: 100,
      },
      errorMessage: "Email must be within 100 characters",
    },
  },
  password: {
    in: ["body"],
    isString: {
      errorMessage: "Password must be a string",
    },
    trim: true,
    isLength: {
      options: { min: 8 },
      errorMessage: "Password must be at least 8 characters",
    },
  },
  confirm_password: {
    in: ["body"],
    isString: {
      errorMessage: "Confirmed password must be a string",
    },
    trim: true,
  },
  phone_number: {
    in: ["body"],
    isString: {
      errorMessage: "Phone number must be a string",
    },
    trim: true,
    matches: {
      options: [NEPALI_MOBILE_REGEX],
      errorMessage:
        "Invalid Nepali mobile number format. Must be 10 digits (e.g., 98XXXXXXXX) with optional +977 prefix.",
    },
  },
  role_id: {
    in: ["body"],
    isString: {
      errorMessage: "Role ID must be a string",
    },
    trim: true,
  },
  address_id: {
    in: ["body"],
    isString: {
      errorMessage: "Address ID must be a string",
    },
    trim: true,
  },
};

export const loginValidation: Schema = {
  username: {
    in: ["body"],
    isString: {
      errorMessage: "Username must be a string",
    },
    trim: true,
  },
  password: {
    in: ["body"],
    isString: {
      errorMessage: "Password must be a string",
    },
    trim: true,
  },
};
