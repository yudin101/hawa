import { Schema } from "express-validator";
import { loginSchema } from "./auth.validator";

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
