import { Schema } from "express-validator";
import { loginSchema } from "./auth.validator";

export const searchAddressSchema: Schema = {
  searchTerm: {
    in: ["query"],
    isString: {
      errorMessage: "Address search term must be a string",
    },
    trim: true,
    toUpperCase: true,
  },
  limit: {
    in: ["query"],
    optional: true,
    isInt: {
      options: {
        min: 1,
        max: 100,
      },
      errorMessage: "Limit must be an integer between 1 and 100",
    },
    toInt: true,
  },
};

export const addAddressSchema: Schema = {
  district: {
    in: ["body"],
    isString: {
      errorMessage: "District must be a string",
    },
    trim: true,
    toUpperCase: true,
  },
  municipality: {
    in: ["body"],
    isString: {
      errorMessage: "Municipality must be a string",
    },
    trim: true,
    toUpperCase: true,
  },
  streetName: {
    in: ["body"],
    isString: {
      errorMessage: "Street name must be a string",
    },
    trim: true,
    toUpperCase: true,
  },
};

export const updateAddressSchema: Schema = {
  district: {
    ...addAddressSchema.district,
    optional: true,
  },
  municipality: {
    ...addAddressSchema.municipality,
    optional: true,
  },
  streetName: {
    ...addAddressSchema.streetName,
    optional: true,
  },
  confirmationPassword: {
    ...loginSchema.password,
  },
  id: {
    in: ["body"],
    isString: {
      errorMessage: "Address ID must be a string",
    },
    trim: true,
  },
};

export const deleteAddressSchema: Schema = {
  id: {
    ...updateAddressSchema.id,
  },
  confirmationPassword: {
    ...loginSchema.password,
  },
};
