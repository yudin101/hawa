import pool from "../config/db";

export const roleExists = async (
  roleId: string, // string cuz it is passed that way
): Promise<boolean> => {
  try {
    const result = await pool.query(`SELECT * FROM roles WHERE id = $1`, [
      roleId,
    ]);

    if (result.rows.length > 0) {
      return true;
    }
    return false;
  } catch (err) {
    throw err;
  }
};

export const getRoleName = async (roleId: string): Promise<string> => {
  try {
    const result = await pool.query(
      `SELECT role FROM roles WHERE role_id = $1`,
      [roleId],
    );
    return result.rows[0].role;
  } catch (err) {
    throw err;
  }
};


export const getRoleId = async (roleName: string): Promise<number> => {
  try {
    const result = await pool.query(
      `SELECT id FROM roles WHERE role = $1`,
      [roleName],
    );
    return result.rows[0].id;
  } catch (err) {
    throw err;
  }
};
