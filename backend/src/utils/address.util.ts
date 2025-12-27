import pool from "../config/db";
import { Address } from "../types/address";

export const findAddress = async (
  addressId: string, // string cuz it is passed that way
): Promise<boolean | Address> => {
  try {
    const result = await pool.query(`SELECT * FROM addresses WHERE id = $1`, [
      addressId,
    ]);

    if (result.rows.length === 1) {
      return result.rows[0] as Address;
    }
    return false;
  } catch (err) {
    throw err;
  }
};
