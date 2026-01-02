import { NextFunction, Request, Response } from "express";
import { matchedData } from "express-validator";
import { findUser, fuzzyFindSeller } from "../utils/user.util";
import pool from "../config/db";
import bcrypt from "bcrypt";

export const searchUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { username, limit } = matchedData(req);

    const searchResults = await fuzzyFindSeller(username, limit);

    res.status(200).json(searchResults);
    return;
  } catch (err) {
    next(err);
  }
};

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const {
      username,
      newPassword,
      confirmNewPassword,
      phoneNumber,
      email,
      addressId,
      confirmationPassword,
    } = matchedData(req);

    const userId: string = req.user?.id as string;

    if (!(await findUser("id", userId))) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const existingPasswordHash = (
      await pool.query(`SELECT password FROM users WHERE id = $1`, [userId])
    ).rows[0].password;

    if (!(await bcrypt.compare(confirmationPassword, existingPasswordHash))) {
      res.status(401).json({ error: "Invalid Credentials" });
      return;
    }

    let setClauses: string[] = [];
    let queryValues: string[] = [userId];
    let placeholderCount = 2;

    if (username) {
      setClauses.push(`username = $${placeholderCount}`);
      placeholderCount++;
      queryValues.push(username);
    }

    if (newPassword) {
      if (confirmNewPassword && confirmNewPassword === newPassword) {
        setClauses.push(`password = $${placeholderCount}`);
        placeholderCount++;
        queryValues.push(await bcrypt.hash(newPassword, 10));
      } else {
        res
          .status(400)
          .json({ error: "New password confirmation does not match" });
        return;
      }
    }

    if (phoneNumber) {
      setClauses.push(`phone_number = $${placeholderCount}`);
      placeholderCount++;
      queryValues.push(phoneNumber);
    }

    if (email) {
      setClauses.push(`email = $${placeholderCount}`);
      placeholderCount++;
      queryValues.push(email);
    }

    if (addressId) {
      setClauses.push(`address_id = $${placeholderCount}`);
      placeholderCount++;
      queryValues.push(addressId);
    }

    if (setClauses.length === 0) {
      res.status(400).json({ error: "No fields provided" });
      return;
    }

    const query = `
      UPDATE users
      SET 
        ${setClauses.join(", ")}
      WHERE id = $1
      RETURNING 
        id, 
        username, 
        email, 
        phone_number AS "phoneNumber", 
        address_id AS "addressId"`;

    const result = await pool.query(query, queryValues);

    res.status(200).json({
      message: "User Updated",
      user: result.rows[0],
    });
    return;
  } catch (err) {
    next(err);
  }
};
