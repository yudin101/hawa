export interface Order {
  orderId: string;
  status: string;
  orderDate: Date | string;
  totalPrice: string;
  deliveryAddressId: string;
  district: string;
  municipality: string;
  streetName: string;
  paymentMethod: string;
  productId: string;
  productName: string;
  quantity: string;
  unitPrice: string;
}

export interface NestedOrderItems {
  orderId: string;
  status: string;
  orderDate: Date | string;
  totalPrice: string;
  paymentMethod: string;
  deliveryAddress: {
    addressId: string;
    district: string;
    municipality: string;
    streetName: string;
  };
  items: {
    productId: string;
    productName: string;
    quantity: string;
    unitPrice: string;
  }[];
}
