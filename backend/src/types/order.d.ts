export interface FlatOrder {
  orderId: string;
  status: "pending" | "shipping" | "delivered" | "cancelled";
  orderDate: Date | string;
  totalPrice: string;
  deliveryAddressId: string;
  district: string;
  municipality: string;
  streetName: string;
  paymentMethod: string;
}

export interface NestedOrder
  extends Omit<
    FlatOrder,
    "deliveryAddressId" | "district" | "municipality" | "streetName"
  > {
  deliveryAddress: {
    addressId: string;
    district: string;
    municipality: string;
    streetName: string;
  };
}

export interface NestedOrderItems extends NestedOrder {
  items: {
    productId: string;
    productName: string;
    quantity: string;
    unitPrice: string;
  }[];
}
