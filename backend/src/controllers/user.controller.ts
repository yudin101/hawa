import { Request, Response } from "express";
import { matchedData } from "express-validator";
import {
  compareHash,
  extractExistingHash,
  findUser,
  fuzzyFindSeller,
  removeUserById,
  updateUserInfo,
  updateUserRole,
} from "../services/user.service";
import bcrypt from "bcrypt";
import env from "../config/env";
import { catchAsync } from "../utils/catchAsync.util";

export const searchUser = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { username, limit } = matchedData(req);

    const searchResults = await fuzzyFindSeller(username, limit);

    res.status(200).json(searchResults);
    return;
  },
);

export const getUser = catchAsync(async (req: Request, res: Response) => {
  const { username } = matchedData(req);
  const result = await findUser("username", username);

  if (!result) {
    res.status(404).json({ error: "Not Found" });
    return;
  }

  res.status(200).json(result);
  return;
});

export const updateUser = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
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

    const existingPasswordHash = await extractExistingHash(userId);

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

    const updatedUser = await updateUserInfo(setClauses, queryValues);

    res.status(200).json({
      message: "User Updated",
      user: updatedUser,
    });
    return;
  },
);

export const changeUserType = (roleIdToConvert: string) => {
  return catchAsync(async (req: Request, res: Response): Promise<void> => {
    const { directUserId, confirmationPassword } = matchedData(req);

    const userId: string = req.user?.id as string;
    const currentRoleId: string = req.user?.roleId as string;

    if (
      !(await findUser("id", userId)) ||
      (directUserId && !(await findUser("id", directUserId)))
    ) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    if (!(await compareHash(confirmationPassword, userId))) {
      res.status(401).json({ error: "Invalid Credentials" });
      return;
    }

    if (!directUserId && currentRoleId === roleIdToConvert) {
      res.status(409).json({ error: "User already of the desired type" });
      return;
    }

    const targetUserId = directUserId ?? userId;
    const updatedUser = await updateUserRole(roleIdToConvert, targetUserId);

    res.status(200).json({
      message: "User type changed",
      user: updatedUser,
    });
    return;
  });
};

export const deleteUser = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { confirmationPassword } = matchedData(req);

    const userId: string = req.user?.id as string;

    if (!(await findUser("id", userId))) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    if (!(await compareHash(confirmationPassword, userId))) {
      res.status(401).json({ error: "Invalid Credentials" });
      return;
    }

    removeUserById(userId);

    res.cookie("refresh_token", "", {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      expires: new Date(0),
    });

    res.status(200).json({ message: "User Deleted! Logged Out!" });
    return;
  },
);
