import pool from "../config/db";
import { Product } from "../types/product";
import { generateOffset } from "../utils/generateOffset.util";
import { generateQueryString } from "../utils/generateQueryString.util";

const selectQuery = `
  SELECT
    p.id,
    p.name,
    p.picture_url AS "pictureUrl",
    p.body,
    c.id AS "categoryId",
    c.category,
    u.id AS "sellerId",
    u.username AS "sellerName",
    p.available_units AS "availableUnits",
    p.price
  FROM products p
  INNER JOIN categories c ON p.category_id = c.id
  INNER JOIN users u ON p.seller_id = u.id`;

const orderByName = `
  ORDER BY
    p.name ASC,
    p.id ASC,
    c.category ASC,
    c.id ASC,
    u.username ASC,
    u.id ASC`;

export const getProducts = async (
  page: number = 1,
  limit: number = 10,
): Promise<Product[]> => {
  const offset = generateOffset(page, limit);

  const result = await pool.query(
    `${selectQuery}
    ${orderByName}
    LIMIT $1 OFFSET $2`,
    [limit, offset],
  );

  return result.rows;
};

export const findProduct = async (productData: {
  id?: string;
  name?: string;
  targetUserId?: string;
}): Promise<Product | undefined> => {
  const { id, name, targetUserId: sellerId } = productData;

  if (name && !sellerId) {
    throw Error("Name and SellerID both required");
  }

  const column = id ? "id" : "name";
  const value = id || name;

  let whereClause = `WHERE p.${column} = $1`;
  let queryValue = [value];

  if (sellerId) {
    whereClause += ` AND seller_id = $2`;
    queryValue.push(sellerId);
  }

  const result = await pool.query(
    `${selectQuery} ${whereClause} ${orderByName}`,
    queryValue,
  );

  return result.rows[0];
};

export const fuzzyFindProduct = async (
  searchTerm: string,
  page: number = 1,
  limit: number = 10,
): Promise<(Product | undefined)[]> => {
  const offset = generateOffset(page, limit);
  const searchTermQuery = `%${searchTerm}%`;

  const result = await pool.query(
    `${selectQuery}
    WHERE
      p.name ILIKE $1
      OR c.category ILIKE $1
      OR u.username ILIKE $1
    ${orderByName}
    LIMIT $2 OFFSET $3`,
    [searchTermQuery, limit, offset],
  );

  return result.rows;
};

export const findProductsByColumn = async (
  columnId: string,
  column: "seller" | "category",
  limit: number = 10,
  page: number = 1,
): Promise<(Product | undefined)[]> => {
  const offset = generateOffset(page, limit);

  const result = await pool.query(
    `${selectQuery}
    WHERE ${column}_id = $1
    ${orderByName}
    LIMIT $2 OFFSET $3`,
    [columnId, limit, offset],
  );

  return result.rows;
};

export const insertProduct = async (productData: {
  name: string;
  pictureUrl: string;
  body: string;
  categoryId: string;
  targetUserId: string;
  availableUnits: string;
  price: string;
}) => {
  const {
    name,
    pictureUrl,
    body,
    categoryId,
    targetUserId: sellerId,
    availableUnits,
    price,
  } = productData;

  const result = await pool.query(
    generateQueryString(
      "products",
      `INSERT INTO products (
      name,
      picture_url,
      body,
      category_id,
      seller_id,
      available_units,
      price
    ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    ),
    [name, pictureUrl, body, categoryId, sellerId, availableUnits, price],
  );

  return result.rows[0];
};
