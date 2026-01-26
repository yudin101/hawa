import pool from "../config/db";
import {
  FlatOrder,
  FlatOrderItem,
  NestedOrder,
  NestedOrderItem,
  ProductRequestItem
} from "../types/order";
import { Product } from "../types/product";
import { generateQueryString } from "../utils/generateQueryString.util";

export const nestOrderItems = (flatOrderItems: FlatOrderItem[]) => {
  const nested = flatOrderItems.reduce<Record<string, NestedOrderItem>>(
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
    {} as Record<string, NestedOrderItem>,
  );

  return Object.values(nested).sort((a, b) => {
    return Number(b.orderId) - Number(a.orderId);
  });
};

export const findOrdersWithItems = async (
  userId: string,
  limit: number = 10,
  page: number = 1,
  orderId?: string,
): Promise<NestedOrderItem[]> => {
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

  const nestedOrderItems = nestOrderItems(result.rows);
  return nestedOrderItems;
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
  if (status === "CANCELLED") {
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

export const findMissingProducts = async (
  items: ProductRequestItem[],
): Promise<{
  missingIds: string[];
  products: Product[];
}> => {
  const productIds = [... new Set(items.map((item) => item.productId))];

  const { rows: products } = await pool.query(
    `SELECT
      id,
      name,
      available_units AS "availableUnits",
      price
    FROM products
    WHERE id = ANY($1)`,
    [productIds],
  );

  let missingIds: string[] = [];

  if (products.length !== productIds.length) {
    const foundIds = products.map((item) => item.id);
    missingIds = productIds.filter((id) => !foundIds.includes(id));
  }

  return { missingIds, products };
};

export const checkStock = async (
  items: ProductRequestItem[],
  products: Product[],
): Promise<
  Omit<Product, "pictureUrl" | "body" | "categoryId" | "sellerId" | "price">[]
> => {
  const insufficient = [];

  for (const item of items) {
    const product = products.find((p) => p.id === item.productId);

    if (Number(product!.availableUnits) < Number(item.quantity)) {
      insufficient.push({
        id: product!.id,
        name: product!.name,
        availableUnits: product!.availableUnits,
        quantity: (product as Product & { quantity: string }).quantity,
      });
    }
  }

  return insufficient;
};

export const findTotalPrice = (
  items: ProductRequestItem[],
  products: Product[],
) => {
  let total = 0;

  for (const item of items) {
    const product = products.find((p) => p.id === item.productId);
    total += parseFloat(product!.price) * Number(item.quantity);
  }

  return total.toFixed(2);
};

export const createOrder = async (orderData: {
  userId: string;
  status: FlatOrder["status"];
  totalPrice: string;
  deliveryAddressId: string;
  paymentMethod: string;
  products: Product[];
  orderItems: ProductRequestItem[];
}) => {
  const {
    userId,
    status,
    totalPrice,
    deliveryAddressId,
    paymentMethod,
    products,
    orderItems,
  } = orderData;
  const productIds = products.map((p) => p.id);
  const quantities = orderItems.map((i) => i.quantity);
  const unitPrices = products.map((p) => p.price);

  const client = await pool.connect();

  try {
    await client.query(`BEGIN`);

    const order = await client.query(
      `INSERT INTO orders (
        user_id,
        status,
        total_price,
        delivery_address_id,
        payment_method
      ) VALUES ($1, $2, $3, $4, $5)
      RETURNING id`,
      [userId, status, totalPrice, deliveryAddressId, paymentMethod],
    );

    const orderId = order.rows[0].id;

    const result = await client.query(
      generateQueryString(
        "order_items",
        `INSERT INTO order_items (
          order_id,
          product_id,
          quantity,
          unit_price
        ) SELECT
          $1,
          UNNEST($2::int[]),
          UNNEST($3::int[]),
          UNNEST($4::numeric[])`,
      ),
      [orderId, productIds, quantities, unitPrices],
    );

    const nestedOrderItems = nestOrderItems(result.rows);

    await client.query(
      `UPDATE products AS p
        SET available_units = p.available_units - d.qty
        FROM (
          SELECT 
            UNNEST($1::int[]) AS id,
            UNNEST($2::int[]) AS qty
        ) AS d
        WHERE p.id = d.id`,
      [productIds, quantities],
    );

    await client.query(`COMMIT`);

    return nestedOrderItems;
  } catch (err) {
    await client.query(`ROLLBACK`);
    throw err;
  } finally {
    client.release();
  }
};
