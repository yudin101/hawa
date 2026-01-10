import { Request, Response } from "express";
import { matchedData } from "express-validator";
import {
  compareHash,
  findUser,
  fuzzyFindSeller,
  generateSetClauses,
  removeUserById,
  updateUserInfo,
  updateUserRole,
} from "../services/user.service";
import env from "../config/env";
import { catchAsync } from "../utils/catchAsync.util";
import { ROLES } from "../constants/roles";

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

    if (
      !(await findUser("id", currentUserId)) ||
      (requestUserId && !(await findUser("id", requestUserId)))
    ) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    if (!(await compareHash(confirmationPassword, currentUserId))) {
      res.status(401).json({ error: "Invalid Credentials" });
      return;
    }

    let targetUserId = currentUserId;
    if (requestUserId && req.user?.roleId === ROLES.ADMIN) {
      targetUserId = requestUserId;
    }

    const { setClauses, queryValues } = await generateSetClauses(
      targetUserId,
      username,
      newPassword,
      phoneNumber,
      email,
      addressId,
    );

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
    const { id: requestUserId, confirmationPassword } = matchedData(req);

    const currentUserId: string = req.user?.id as string;
    const currentUserRoleId: string = req.user?.roleId as string;

    if (
      !(await findUser("id", currentUserId)) ||
      (requestUserId && !(await findUser("id", requestUserId)))
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

    const targetUserId = requestUserId ?? currentUserId;
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

    if (
      !(await findUser("id", currentUserId)) ||
      (requestUserId && !(await findUser("id", requestUserId)))
    ) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    if (!(await compareHash(confirmationPassword, currentUserId))) {
      res.status(401).json({ error: "Invalid Credentials" });
      return;
    }

    let targetUserId = currentUserId;
    if (requestUserId && req.user?.roleId === ROLES.ADMIN) {
      targetUserId = requestUserId;
    }

    await removeUserById(targetUserId);

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
