import pool from "../config/db";

export const userExists = async (
  userRoleId: string,
  valueType: "username" | "email" | "phoneNumber",
  value: string,
): Promise<boolean> => {
  try {
    const result = await pool.query(
      `SELECT * FROM users WHERE role_id = $1 AND $2 = $3`,
      [userRoleId, valueType, value],
    );

    if (result.rows.length > 0) {
      return true;
    }
    return false;
  } catch (err) {
    throw err;
  }
};
