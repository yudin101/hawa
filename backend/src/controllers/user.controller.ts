import { Request, Response } from "express";
import { matchedData } from "express-validator";
import {
  findUser,
  fuzzyFindSeller,
  updateUserRole,
} from "../services/user.service";
import { compareHash } from "../services/auth.service";
import { generateSetClauses } from "../utils/generateSetClauses.util";
import env from "../config/env";
import { catchAsync } from "../utils/catchAsync.util";
import { ROLES } from "../constants/roles";
import { removeById, updateInfo } from "../services/common.service";

export const searchUser = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { username, page, limit } = matchedData(req);

    const searchResults = await fuzzyFindSeller(username, page, limit);

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
    let {
      id: requestUserId,
      username,
      newPassword,
      phoneNumber,
      email,
      addressId,
      confirmationPassword,
    } = matchedData(req);

    const currentUserId: string = req.user?.id as string;
    const isAdmin = req.user?.roleId === ROLES.ADMIN;

    if (
      !(await findUser("id", currentUserId)) ||
      (isAdmin && requestUserId && !(await findUser("id", requestUserId)))
    ) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    if (!(await compareHash(confirmationPassword, currentUserId))) {
      res.status(401).json({ error: "Invalid Credentials" });
      return;
    }

    let targetUserId = currentUserId;
    if (requestUserId && isAdmin) {
      targetUserId = requestUserId;
    }

    const { setClauses, queryValues } = generateSetClauses(
      ["id", "username", "password", "phone_number", "email", "address_id"],
      [targetUserId, username, newPassword, phoneNumber, email, addressId],
    );

    if (setClauses.length === 0) {
      res.status(400).json({ error: "No fields provided" });
      return;
    }

    const updatedUser = await updateInfo("users", setClauses, queryValues);

    res.status(200).json({
      message: "User Updated",
      user: updatedUser,
    });
    return;
  },
);

export const changeUserType = (roleIdToConvert: string) => {
  return catchAsync(async (req: Request, res: Response): Promise<void> => {
    const { id: requestUserId, confirmationPassword } = matchedData(req);

    const currentUserId: string = req.user?.id as string;
    const currentUserRoleId: string = req.user?.roleId as string;
    const isAdmin = currentUserRoleId === ROLES.ADMIN;

    if (
      !(await findUser("id", currentUserId)) ||
      (isAdmin && requestUserId && !(await findUser("id", requestUserId)))
    ) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    if (!(await compareHash(confirmationPassword, currentUserId))) {
      res.status(401).json({ error: "Invalid Credentials" });
      return;
    }

    if (!requestUserId && currentUserRoleId === roleIdToConvert) {
      res.status(409).json({ error: "User already of the desired type" });
      return;
    }

    let targetUserId = currentUserId;
    if (requestUserId && isAdmin) {
      targetUserId = requestUserId;
    }

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
    const { id: requestUserId, confirmationPassword } = matchedData(req);

    const currentUserId: string = req.user?.id as string;
    const isAdmin = req.user?.roleId === ROLES.ADMIN;

    if (
      !(await findUser("id", currentUserId)) ||
      (isAdmin && requestUserId && !(await findUser("id", requestUserId)))
    ) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    if (!(await compareHash(confirmationPassword, currentUserId))) {
      res.status(401).json({ error: "Invalid Credentials" });
      return;
    }

    let targetUserId = currentUserId;
    if (requestUserId && isAdmin) {
      targetUserId = requestUserId;
    }

    await removeById("users", targetUserId);

    let responseMessage = "User Deleted!";
    if (targetUserId === currentUserId) {
      res.cookie("refresh_token", "", {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        expires: new Date(0),
      });

      responseMessage = responseMessage + " Logged Out!";
    }

    res.status(200).json({ message: responseMessage });
    return;
  },
);
