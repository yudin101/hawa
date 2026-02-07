export const OSTATUS = {
  PENDING: "PENDING",
  SHIPPING: "SHIPPING",
  DELIVERED: "DELIVERED",
  CANCELLED: "CANCELLED",
} as const;

export type OStatusType = (typeof OSTATUS)[keyof typeof OSTATUS];
