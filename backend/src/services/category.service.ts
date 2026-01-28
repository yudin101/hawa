import pool from "../config/db";
import { generateOffset } from "../utils/generateOffset.util";
import { generateQueryString } from "../utils/generateQueryString.util";

export const getCategory = async (page: number = 1, limit: number = 10) => {
  const offset = generateOffset(page, limit);
  const result = await pool.query(
    `SELECT * FROM categories
    ORDER BY
      category ASC,
      id ASC
    LIMIT $1
    OFFSET $2`,
    [limit, offset],
  );

  return result.rows;
};

export const findCategory = async (categoryData: {
  categoryId?: string;
  category?: string;
}) => {
  const { categoryId, category } = categoryData;

  const column = categoryId ? "id" : "category";
  const value = categoryId || category;

  if (!value) return null;

  const result = await pool.query(
    `SELECT * FROM categories
    WHERE ${column} = $1`,
    [value],
  );

  return result.rows[0];
};

export const fuzzyFindCategory = async (
  searchTerm: string,
  page: number = 1,
  limit: number = 10,
) => {
  const querySearchTerm = `%${searchTerm}%`;
  const offset = generateOffset(page, limit);

  const result = await pool.query(
    `SELECT * FROM categories
    WHERE category ILIKE $1
    ORDER BY
      category ASC,
      id ASC
    LIMIT $2
    OFFSET $3`,
    [querySearchTerm, limit, offset],
  );

  return result.rows;
};

export const insertCategory = async (category: string) => {
  const result = await pool.query(
    generateQueryString(
      "categories",
      `INSERT INTO categories (category)
      VALUES ($1)`,
    ),
    [category],
  );

  return result.rows[0];
};
