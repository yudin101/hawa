import pool from "../config/db";
import { NestedOrderItems, FlatOrder, NestedOrder } from "../types/order";

export const findOrdersWithItems = async (
  userId: string,
  limit: number = 10,
  page: number = 1,
  orderId?: string,
): Promise<NestedOrderItems[]> => {
  const offset = (page - 1) * limit;
  const queryParams = [userId, limit, offset];

  if (orderId) queryParams.push(orderId);

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
      WHERE user_id = $1 ${orderId ? `AND id = $4` : ``}
      ORDER BY id DESC
      LIMIT $2 OFFSET $3
    ) o
    INNER JOIN addresses a ON o.delivery_address_id = a.id
    INNER JOIN order_items oi ON oi.order_id = o.id
    INNER JOIN products p ON oi.product_id = p.id`,
    queryParams,
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

export const findOrder = async (
  userId: string,
  orderId: string,
): Promise<NestedOrder | undefined> => {
  const result = await pool.query(
    `SELECT
      o.id AS "orderId",
      o.user_id AS "userId",
      o.status,
      o.order_date AS "orderDate",
      o.total_price AS "totalPrice",
      o.payment_method AS "paymentMethod",
      a.id AS "deliveryAddressId",
      a.district,
      a.municipality,
      a.street_name AS "streetName"
    FROM orders o
    INNER JOIN addresses a ON o.delivery_address_id = a.id
    WHERE o.user_id = $1 AND o.id = $2`,
    [userId, orderId],
  );

  const order = result.rows[0] as FlatOrder;

  if (!order) {
    return undefined;
  }

  const {
    deliveryAddressId: addressId,
    district,
    municipality,
    streetName,
    ...orderData
  } = order;

  return {
    ...orderData,
    deliveryAddress: {
      addressId,
      district,
      municipality,
      streetName,
    },
  };
};

export const changeOrderStatus = async (
  userId: string,
  orderId: string,
  status: FlatOrder["status"],
) => {
  if (status === "cancelled") {
    const client = await pool.connect();

    try {
      await client.query(`BEGIN`);

      await client.query(
        `UPDATE orders
        SET status = 'cancelled'
        WHERE id = $1`,
        [orderId],
      );

      const order = await findOrdersWithItems(userId, 1, 1, orderId);
      const orderItems = order[0]?.items;

      const quantities = orderItems?.map((item) => item.quantity);
      const productIds = orderItems?.map((item) => item.productId);

      await client.query(
        `UPDATE products AS p
        SET available_units = p.available_units + d.qty
        FROM (
          SELECT 
            UNNEST($1::int[]) AS qty,
            UNNEST($2::int[]) AS id
        ) AS d
        WHERE p.id = d.id`,
        [quantities, productIds],
      );

      await client.query(`COMMIT`);
    } catch (err) {
      await client.query(`ROLLBACK`);
      throw err;
    } finally {
      client.release();
    }
  }
};

interface Products {
  id: string;
  name: string;
  availableUnits: string;
  quantity: string;
}

export const findMissingProducts = async (
  items: { productId: string; quantity: string }[],
): Promise<{
  missingIds: string[];
  products: Products[];
}> => {
  const productIds = items.map((item) => item.productId);

  const { rows: products } = await pool.query(
    `SELECT
      id,
      name,
      available_units AS "availableUnits",
      quantity
    FROM products
    WHERE id = ANY($1)`,
    [productIds],
  );

  let missingIds: string[] = [];

  if (products.length !== productIds.length) {
    const foundIds = products.map((item) => item.productId);
    missingIds = productIds.filter((id) => !foundIds.includes(id));
  }

  return { missingIds, products };
};

export const checkStock = async (
  items: { productId: string; quantity: string }[],
  products: Products[],
): Promise<Products[]> => {
  const insufficient = [];

  for (const item of items) {
    const product = products.find((p) => p.id === item.productId);

    if (product!.availableUnits < item.quantity) {
      insufficient.push({
        id: product!.id,
        name: product!.name,
        availableUnits: product!.availableUnits,
        quantity: product!.quantity,
      });
    }
  }

  return insufficient;
};
