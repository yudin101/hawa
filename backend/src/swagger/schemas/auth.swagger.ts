export const UserLoginRequest = {
  type: "object",
  required: ["username", "password"],
  properties: {
    username: { type: "string" },
    password: { type: "string", format: "password" },
  },
};

export const UserRegisterRequest = {
  type: "object",
  required: [
    "username",
    "email",
    "password",
    "confirmPassword",
    "phoneNumber",
    "addressId",
  ],
  properties: {
    username: { type: "string" },
    password: { type: "string", format: "password" },
    confirmPassword: { type: "string", format: "password" },
    email: { type: "string" },
    phoneNumber: { type: "string" },
    addressId: { type: "string" },
  },
};
