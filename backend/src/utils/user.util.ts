import pool from "../config/db";
import { User } from "../types/user";
import { findRole } from "./role.util";

export const removeSensitiveInformation = async (user: User) => {
  try {
    const roleInfo = await findRole("id", user.roleId);
    const sellerRoleInfo = await findRole("role", "Seller");

    let cleanedUser = {
      id: user.id,
      username: user.username,
      roleId: user.roleId,
    } as User;

    if (roleInfo && sellerRoleInfo && roleInfo.id === sellerRoleInfo.id) {
      cleanedUser = {
        ...cleanedUser,
        phoneNumber: user.phoneNumber,
        email: user.email,
        addressId: user.addressId,
      };
    }

    return cleanedUser;
  } catch (err) {
    throw err;
  }
};

export const findUser = async (
  valueType: "id" | "username" | "email" | "phone_number",
  value: string,
): Promise<false | User> => {
  try {
    const result = await pool.query(
      `SELECT id,
        role_id AS "roleId",
        username,
        phone_number AS "phoneNumber",
        email,
        address_id AS "addressId"
      FROM users
      WHERE ${valueType} = $1`,
      [value],
    );

    if (result.rows.length === 1) {
      return await removeSensitiveInformation(result.rows[0]);
    }
    return false;
  } catch (err) {
    throw err;
  }
};

export const fuzzyFindSeller = async (username: string, limit: number = 10) => {
  try {
    const SELLER_ROLE_ID = 3;
    const searchTerm = `%${username}%`;
    const result = await pool.query(
      `SELECT
        u.id,
        u.role_id AS "roleId",
        u.username,
        u.phone_number AS "phoneNumber",
        u.email,
        a.id,
        a.district,
        a.municipality,
        a.street_name AS "streetName"
      FROM users u
      INNER JOIN addresses a ON u.address_id = a.id
      WHERE username ILIKE $1 AND u.role_id = $2
      LIMIT $3`,
      [searchTerm, SELLER_ROLE_ID, limit],
    );
    return result.rows;
  } catch (err) {
    throw err;
  }
};
