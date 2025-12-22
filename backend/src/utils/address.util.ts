import pool from "../config/db";

export const addressExists = async (
  addressId: string // string cuz it is passed that way
): Promise<boolean> => {
  try {
    const result = await pool.query(
      `SELECT * FROM addresses WHERE id = $1`,
      [addressId],
    );

    if (result.rows.length > 0) {
      return true;
    }
    return false;
  } catch (err) {
    throw err;
  }
};
