import pool from "../config/db";
import { ROLES } from "../constants/roles";
import { User } from "../types/user";
import bcrypt from "bcrypt";
import { generateQueryString } from "../utils/generateQueryString.util";
import { generateOffset } from "../utils/generateOffset.util";

export const createUser = async (userData: {
  username: string;
  email: string;
  password: string;
  phoneNumber: string;
  addressId: string;
  roleId: string;
}) => {
  const { username, email, password, phoneNumber, addressId, roleId } =
    userData;

  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await pool.query(
    generateQueryString(
      "users",
      `INSERT INTO users (
        username,
        email,
        password,
        phone_number,
        address_id,
        role_id
      ) VALUES ($1, $2, $3, $4, $5, $6)`,
    ),
    [username, email, hashedPassword, phoneNumber, addressId, roleId],
  );

  return result.rows[0];
};

export const sanitizeUser = (user: User) => {
  let cleanedUser = {
    id: user.id,
    roleId: user.roleId,
    username: user.username,
  } as User;

  if (user.roleId !== ROLES.SELLER) return cleanedUser;

  return {
    ...cleanedUser,
    phoneNumber: user.phoneNumber,
    email: user.email,
    addressId: user.addressId,
    district: user.district,
    municipality: user.municipality,
    streetName: user.streetName,
  };
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
    return sanitizeUser(result.rows[0]);
  }
  return false;
};

export const fuzzyFindSeller = async (
  username: string,
  page: number = 1,
  limit: number = 10,
) => {
  const searchTerm = `%${username}%`;
  const offset = generateOffset(page, limit);

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
    ORDER BY 
      username ASC,
      id ASC
    LIMIT $3
    OFFSET $4`,
    [searchTerm, ROLES.SELLER, limit, offset],
  );
  return result.rows;
};

export const updateUserRole = async (roleId: string, targetUserId: string) => {
  const result = await pool.query(
    generateQueryString(
      "users",
      `UPDATE users
      SET role_id = $1
      WHERE id = $2`,
    ),
    [roleId, targetUserId],
  );

  return result.rows[0];
};
