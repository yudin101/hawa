import { OStatusType } from "../constants/orderStatus";

export interface FlatOrder {
  orderId: string;
  status: OStatusType;
  orderDate: Date | string;
  totalPrice: string;
  deliveryAddressId: string;
  district: string;
  municipality: string;
  streetName: string;
  paymentMethod: string;
}

export interface FlatOrderItem extends FlatOrder {
  productId: string;
  productName: string;
  quantity: string;
  unitPrice: string;
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

export interface NestedOrderItem extends NestedOrder {
  items: {
    productId: string;
    productName: string;
    quantity: string;
    unitPrice: string;
  }[];
}

export interface ProductRequestItem {
  productId: string;
  quantity: string;
}
