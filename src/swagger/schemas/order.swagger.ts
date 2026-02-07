export const GetMyOrdersRequest = {
  $userId: "1",
};

export const OrderPlaceRequest = {
  $orderItems: [{ quantity: "2", productId: "32" }],
  $paymentMethod: "CASH",
  $deliveryAddressId: "3",
};

export const OrderStatusRequest = {
  $orderId: "22",
  $userId: "1"
}
