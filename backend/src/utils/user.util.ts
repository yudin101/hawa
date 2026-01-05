import pool from "../config/db";
import { ROLES } from "../constants/roles";
import { User } from "../types/user";
import bcrypt from "bcrypt";

export const removeSensitiveInformation = async (user: User) => {
  let cleanedUser = {
    id: user.id,
    roleId: user.roleId,
    username: user.username,
  } as User;

  if (user.roleId === ROLES.SELLER) {
    cleanedUser = {
      ...cleanedUser,
      phoneNumber: user.phoneNumber,
      email: user.email,
      addressId: user.addressId,
      district: user.district,
      municipality: user.municipality,
      streetName: user.streetName,
    };
  }

  return cleanedUser;
};

export const findUser = async (
  valueType: "id" | "username" | "email" | "phone_number",
  value: string,
): Promise<false | User> => {
  const result = await pool.query(
    `SELECT
      u.id,
      u.username,
      u.role_id AS "roleId",
      u.phone_number AS "phoneNumber",
      u.email,
      u.address_id AS "addressId",
      a.district,
      a.municipality,
      a.street_name AS "streetName"
    FROM users u
    INNER JOIN addresses a ON u.address_id = a.id
    WHERE u.${valueType} = $1`,
    [value],
  );

  if (result.rows.length === 1) {
    return await removeSensitiveInformation(result.rows[0]);
  }
  return false;
};

export const fuzzyFindSeller = async (username: string, limit: number = 10) => {
  const searchTerm = `%${username}%`;
  const result = await pool.query(
    `SELECT
      u.id,
      u.role_id AS "roleId",
      u.username,
      u.phone_number AS "phoneNumber",
      u.email,
      a.id AS "addressId",
      a.district,
      a.municipality,
      a.street_name AS "streetName"
    FROM users u
    INNER JOIN addresses a ON u.address_id = a.id
    WHERE username ILIKE $1 AND u.role_id = $2
    LIMIT $3`,
    [searchTerm, ROLES.SELLER, limit],
  );
  return result.rows;
};

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
