import pool from "../config/db";
import { User } from "../types/user";

export const findUser = async (
  userRoleId: string,
  valueType: "username" | "email" | "phone_number",
  value: string,
): Promise<boolean | User> => {
  try {
    const result = await pool.query(
      `SELECT * FROM users WHERE role_id = $1 AND ${valueType} = $2`,
      [userRoleId, value],
    );

    if (result.rows.length === 1) {
      return result.rows[0];
    }
    return false;
  } catch (err) {
    throw err;
  }
};
