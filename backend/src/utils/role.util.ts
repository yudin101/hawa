import pool from "../config/db";

export const findRole = async (
  valueType: "name" | "id",
  value: string,
): Promise<boolean | { id: string; role: string }> => {
  try {
    const result = await pool.query(
      `SELECT * FROM roles WHERE ${valueType} = $1`,
      [value],
    );

    if (result.rows.length === 1) {
      return result.rows[0];
    }
    return false;
  } catch (err) {
    throw err;
  }
};
