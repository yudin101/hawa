import pool from "../config/db";
import bcrypt from "bcrypt";
import { addressExists } from "./address.util";
import { roleExists } from "./role.util";

export const userExists = async (
  userRoleId: string,
  valueType: "username" | "email",
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

export const userRegister = async (body: {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  addressId: string;
  roleId: string;
}): Promise<{ success: boolean; message: string }> => {
  try {
    const {
      username,
      email,
      password,
      confirmPassword,
      phoneNumber,
      addressId,
      roleId,
    } = body;

    if (!(await roleExists(roleId))) {
      return { success: false, message: "Role does not exist" };
    }

    if (await userExists(roleId, "email", email)) {
      return { success: false, message: "Email already exists" };
    }

    if (await userExists(roleId, "username", username)) {
      return { success: false, message: "Username already exists" };
    }

    if (password !== confirmPassword) {
      return { success: false, message: "Password confirmation does not match" };
    }

    if (!(await addressExists(addressId))) {
      return { success: false, message: "Address does not exist" };
    }

    await pool.query(
      `INSERT INTO users (username, email, password, phone_number, addressId, roleId)
      VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        username,
        email,
        await bcrypt.hash(password, 10),
        phoneNumber,
        addressId,
        roleId,
      ],
    );

    return { success: true, message: "Registered Successfully" };
  } catch (err) {
    throw err;
  }
};
