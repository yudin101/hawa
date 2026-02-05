export const UserUpdateRequest = {
  type: "object",
  required: ["id", "confirmationPassword"],
  properties: {
    id: { type: "string" },
    username: { type: "string" },
    newPassword: { type: "string", format: "password" },
    confirmNewPassword: { type: "string", format: "password" },
    email: { type: "string" },
    phoneNumber: { type: "string" },
    addressId: { type: "string" },
  },
};

export const UserChangeDeleteRequest = {
  type: "object",
  required: ["confirmationPassword"],
  properties: {
    id: { type: "string" },
    confirmationPassword: { type: "string", format: "password" },
  },
};
