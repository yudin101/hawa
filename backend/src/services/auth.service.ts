import pool from "../config/db";
import bcrypt from "bcrypt";

export const compareHash = async (
  plainPassword: string,
  userId: string,
): Promise<boolean> => {
  const existingPasswordHash = (
    await pool.query(`SELECT password FROM users WHERE id = $1`, [userId])
  ).rows[0].password;

  if (!(await bcrypt.compare(plainPassword, existingPasswordHash))) {
    return false;
  }

  return true;
};
