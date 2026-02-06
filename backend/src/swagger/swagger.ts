import swaggerAutogenInit from "swagger-autogen";
import { UserLoginRequest, UserRegisterRequest } from "./schemas/auth.swagger";
import {
  UserUpdateRequest,
  UserChangeDeleteRequest,
  UserToAdminRequest,
} from "./schemas/user.swagger";
import {
  AddressAddRequest,
  AddressDeleteRequest,
  AddressUpdateRequest,
} from "./schemas/address.swagger";
import {
  CategoryAddRequest,
  CategoryDeleteRequest,
  CategoryUpdateRequest,
} from "./schemas/category.swagger";
import {
  ProductAddRequest,
  ProductDeleteRequest,
  ProductUpdateRequest,
} from "./schemas/product.swagger";
import { CartAddRequest, CartDeleteRequest } from "./schemas/cart.swagger";

const swaggerAutogen = swaggerAutogenInit({ openapi: "3.0.0" });

const doc = {
  info: {
    title: "Hawa API",
    description: "E-commerce API",
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Local Server",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
      refreshTokenAuth: {
        type: "apiKey",
        in: "cookie",
        name: "refresh_token",
      },
    },
    schemas: {
      UserLoginRequest: UserLoginRequest,
      UserRegisterRequest: UserRegisterRequest,
      UserUpdateRequest: UserUpdateRequest,
      UserChangeDeleteRequest: UserChangeDeleteRequest,
      UserToAdminRequest: UserToAdminRequest,
      AddressAddRequest: AddressAddRequest,
      AddressUpdateRequest: AddressUpdateRequest,
      AddressDeleteRequest: AddressDeleteRequest,
      CategoryAddRequest: CategoryAddRequest,
      CategoryUpdateRequest: CategoryUpdateRequest,
      CategoryDeleteRequest: CategoryDeleteRequest,
      ProductAddRequest: ProductAddRequest,
      ProductUpdateRequest: ProductUpdateRequest,
      ProductDeleteRequest: ProductDeleteRequest,
      CartAddRequest: CartAddRequest,
      CartDeleteRequest: CartDeleteRequest,
    },
  },
};

const outputFile = "./swagger-output.json";
const endpointsFiles = ["../app.ts"];

swaggerAutogen(outputFile, endpointsFiles, doc);
