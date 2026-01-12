import { generateQueryString } from "../utils/generateQueryString.util";
import pool from "../config/db";

export const updateInfo = async (
  tableName: "users" | "addresses",
  setClauses: string[],
  queryValues: string[],
) => {
  const result = await pool.query(
    generateQueryString(
      tableName,
      `UPDATE ${tableName}
      SET
        ${setClauses.join(", ")}
      WHERE id = $1`,
    ),
    queryValues,
  );

  return result.rows[0];
};

export const removeById = async (
  tableName: "users" | "addresses",
  id: string,
) => {
  await pool.query(`DELETE FROM ${tableName} WHERE id = $1`, [id]);
};
