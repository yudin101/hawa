import pool from "../config/db";

export const findRole = async (
  valueType: "role" | "id",
  value: string,
): Promise<false | { id: string; role: string }> => {
  const result = await pool.query(
    `SELECT * FROM roles WHERE ${valueType} = $1`,
    [value],
  );

  if (result.rows.length === 1) {
    return result.rows[0];
  }
  return false;
};
