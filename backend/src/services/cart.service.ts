import pool from "../config/db";
import { CartItems } from "../types/cart";
import { generateQueryString } from "../utils/generateQueryString.util";

export const findCart = async (userId: string): Promise<CartItems[]> => {
  const result = await pool.query(
    `SELECT
      c.id AS "cartId",
      ci.id AS "itemId",
      p.id AS "productId",
      p.name AS "productName",
      p.picture_url AS "productPictureUrl",
      p.body AS "productBody",
      ct.category AS "productCategory",
      u.id AS "sellerId",
      u.username AS "seller",
      p.available_units AS "availableUnits",
      p.price AS "unitPrice",
      ci.quantity,
      (ci.quantity * p.price) AS "totalPrice",
      c.last_modified AS "lastModified"
    FROM cart_items ci
    LEFT JOIN carts c ON c.id = ci.cart_id
    LEFT JOIN products p ON p.id = ci.product_id
    LEFT JOIN categories ct ON ct.id = p.category_id
    LEFT JOIN users u ON u.id = p.seller_id
    WHERE c.user_id = $1`,
    [userId],
  );

  return result.rows;
};

export const createCart = async (userId: string) => {
  const result = await pool.query(
    generateQueryString(
      "carts",
      `INSERT INTO carts (user_id)
      VALUES ($1)
      ON CONFLICT (user_id)
      DO UPDATE SET last_modified = NOW()`,
    ),
    [userId],
  );

  return result.rows[0];
};

export const insertToCart = async (cartItemData: {
  cartId: string;
  productId: string;
  quantity: string;
}) => {
  const { cartId, productId, quantity } = cartItemData;

  const result = await pool.query(
    generateQueryString(
      "cart_items",
      `INSERT INTO cart_items (
        cart_id,
        product_id,
        quantity
      ) VALUES ($1, $2, $3)`,
    ),
    [cartId, productId, quantity],
  );

  return result.rows[0];
};

export const removeFromCart = async (cartItemData: {
  cartId: string;
  productId: string;
}) => {
  const { cartId, productId } = cartItemData;

  await pool.query(
    `DELETE FROM cart_items
    WHERE cart_id = $1 AND product_id = $2`,
    [cartId, productId],
  );
};
