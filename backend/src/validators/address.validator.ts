import { Schema } from "express-validator";
import { loginSchema } from "./auth.validator";
import { searchUserSchema } from "./user.validator";

export const searchAddressSchema: Schema = {
  searchTerm: {
    in: ["query"],
    isString: {
      errorMessage: "Address search term must be a string",
    },
    trim: true,
    isLength: {
      options: {
        min: 2,
        max: 50,
      },
      errorMessage: "Address search term must be between 2 and 50 characters",
    },
    toUpperCase: true,
  },
  page: {
    ...searchUserSchema.page,
  },
  limit: {
    ...searchUserSchema.limit,
  },
};

export const addAddressSchema: Schema = {
  district: {
    in: ["body"],
    isString: {
      errorMessage: "District must be a string",
    },
    trim: true,
    isLength: {
      options: {
        min: 2,
        max: 50,
      },
      errorMessage: "District length must be between 2 and 50",
    },
    toUpperCase: true,
  },
  municipality: {
    in: ["body"],
    isString: {
      errorMessage: "Municipality must be a string",
    },
    trim: true,
    isLength: {
      options: {
        min: 2,
        max: 50,
      },
      errorMessage: "Municipality length must be between 2 and 50",
    },
    toUpperCase: true,
  },
  streetName: {
    in: ["body"],
    isString: {
      errorMessage: "Street name must be a string",
    },
    trim: true,
    isLength: {
      options: {
        min: 2,
        max: 50,
      },
      errorMessage: "Street name length must be between 2 and 50",
    },
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
