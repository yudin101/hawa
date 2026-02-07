export const ProductAddRequest = {
  $name: "Smart Phone",
  $pictureUrl: "/image/url/img.webp",
  $body: "This is a smart phone.",
  $categoryId: "2",
  $sellerId: "5",
  $availableUnits: "300",
  $price: "25000",
};

export const ProductUpdateRequest = {
  $id: "32",
  name: "Smart Phone",
  pictureUrl: "/image/url/img.webp",
  body: "This is a smart phone.",
  categoryId: "2",
  sellerId: "5",
  availableUnits: "300",
  price: "25000",
  $confirmationPassword: "password123",
};

export const ProductDeleteRequest = {
  $id: "32",
  $confirmationPassword: "password123",
};
