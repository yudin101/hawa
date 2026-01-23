import pool from "../config/db";
import { NestedOrderItems } from "../types/order";

export const findOrders = async (
  userId: string,
  limit: number = 10,
  page: number = 1,
): Promise<NestedOrderItems[]> => {
  const offset = (page - 1) * limit;

  const result = await pool.query(
    `SELECT
      o.id AS "orderId",
      o.status,
      o.order_date AS "orderDate",
      o.total_price AS "totalPrice",
      o.delivery_address_id AS "deliveryAddressId",
      a.district,
      a.municipality,
      a.street_name AS "streetName",
      o.payment_method AS "paymentMethod",
      oi.product_id AS "productId",
      p.name AS "productName",
      oi.quantity,
      oi.unit_price AS "unitPrice"
    FROM (
      SELECT * FROM orders
      WHERE user_id = $1
      ORDER BY id DESC
      LIMIT $2 OFFSET $3
    ) o
    INNER JOIN addresses a ON o.delivery_address_id = a.id
    INNER JOIN order_items oi ON oi.order_id = o.id
    INNER JOIN products p ON oi.product_id = p.id`,
    [userId, limit, offset],
  );

  const nestedOrderItems = result.rows.reduce<Record<string, NestedOrderItems>>(
    (acc, row) => {
      if (!acc[row.orderId]) {
        acc[row.orderId] = {
          orderId: row.orderId,
          status: row.status,
          orderDate: row.orderDate,
          totalPrice: row.totalPrice,
          paymentMethod: row.paymentMethod,
          deliveryAddress: {
            addressId: row.deliveryAddressId,
            district: row.district,
            municipality: row.municipality,
            streetName: row.streetName,
          },
          items: [],
        };
      }

      acc[row.orderId]!.items.push({
        productId: row.productId,
        productName: row.productName,
        quantity: row.quantity,
        unitPrice: row.unitPrice,
      });

      return acc;
    },
    {},
  );

  return Object.values(nestedOrderItems).sort((a, b) => {
    return Number(b.orderId) - Number(a.orderId);
  });
};
