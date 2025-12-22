import { Request, Response, NextFunction } from "express";
import pool from "../config/db";
import bcrypt from "bcrypt";
import { matchedData } from "express-validator";
import { userExists } from "../utils/user.utils";
import { roleExists } from "../utils/role.util";
import { addressExists } from "../utils/address.util";

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const {
      username,
      email,
      password,
      confirm_password: confirmPassword,
      phone_number: phoneNumber,
      address_id: addressId,
      role_id: roleId,
    } = matchedData(req);

    console.log({
      username,
      email,
      password,
      confirmPassword,
      phoneNumber,
      addressId,
      roleId,
    });

    if (!(await roleExists(roleId))) {
      res.status(400).json({ error: "Role does not exist" });
      return;
    }

    if (await userExists(roleId, "email", email)) {
      res.status(400).json({ error: "Email already exists" });
      return;
    }

    if (await userExists(roleId, "username", username)) {
      res.status(400).json({ error: "Username already exists" });
      return;
    }

    if (password !== confirmPassword) {
      res.status(400).json({ error: "Password confirmation does not match" });
      return;
    }

    if (!(await addressExists(addressId))) {
      res.status(400).json({ error: "Address does not exist" });
      return;
    }

    await pool.query(
      `INSERT INTO users (username, email, password, phone_number, address_id, role_id)
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

    res.status(400).json({ message: "Registered Successfully" });
    return;
  } catch (err) {
    throw err;
  }
};
