import pool from "../config/db";
import { Cart } from "../types/cart";

export const findCart = async (userId: string): Promise<Cart[]> => {
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
