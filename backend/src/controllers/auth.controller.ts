import { Request, Response } from "express";
import { matchedData } from "express-validator";
import { createUser, findUser } from "../services/user.service";
import { compareHash } from "../services/auth.service";
import { findAddress } from "../services/address.service";
import {
  addRefreshTokenRecord,
  findStoredToken,
  generateAccessToken,
  generateRefreshToken,
  replaceRefreshTokenRecord,
  revokeRefreshTokenRecord,
  verifyRefreshToken,
} from "../services/token.service";
import env from "../config/env";
import { RoleIdType } from "../constants/roles";
import { catchAsync } from "../utils/catchAsync.util";

export const registerUser = (roleId: RoleIdType) => {
  return catchAsync(async (req: Request, res: Response): Promise<void> => {
    let { username, email, password, phoneNumber, addressId } =
      matchedData(req);

    if (await findUser("username", username)) {
      res.status(409).json({ error: "Username already exists" });
      return;
    }

    if (await findUser("email", email)) {
      res.status(409).json({ error: "Email already exists" });
      return;
    }

    if (await findUser("phone_number", phoneNumber)) {
      res.status(409).json({ error: "Phone number already exists" });
      return;
    }

    if (!(await findAddress("id", { addressId }))) {
      res.status(404).json({ error: "Address does not exist" });
      return;
    }

    const registeredUser = await createUser({
      username,
      email,
      password,
      phoneNumber,
      addressId,
      roleId,
    });

    res
      .status(201)
      .json({ message: "Registered Successfully", user: registeredUser });
    return;
  });
};

export const loginUser = catchAsync(async (req: Request, res: Response) => {
  const { username, password } = matchedData(req);

  const user = await findUser("username", username);

  if (!user || !(await compareHash(password, user.id))) {
    res.status(401).json({ error: "Invalid Credentials" });
    return;
  }

  const accessPayload = { id: user.id, roleId: user.roleId };
  const refreshPayload = {
    id: user.id,
    roleId: user.roleId,
    jti: crypto.randomUUID(),
  };

  const accessToken = generateAccessToken(accessPayload);
  const { refreshToken, expiresAt } = generateRefreshToken(refreshPayload);

  await addRefreshTokenRecord(refreshPayload, expiresAt);

  res.cookie("refresh_token", refreshToken, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({ accessToken: accessToken });
  return;
});

export const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refresh_token: refreshToken } = matchedData(req);

  if (refreshToken === undefined) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const decoded = verifyRefreshToken(refreshToken);

    const storedToken = await findStoredToken(decoded.jti);

    if (!storedToken) {
      res.status(403).json({ error: "Session Expired! Please log in again." });
      return;
    }

    const accessPayload = {
      id: decoded.id,
      roleId: decoded.roleId,
    };

    const refreshPayload = {
      ...accessPayload,
      jti: crypto.randomUUID(),
    };

    const accessToken = generateAccessToken(accessPayload);
    const { refreshToken: newRefreshToken, expiresAt } =
      generateRefreshToken(refreshPayload);

    await replaceRefreshTokenRecord(decoded.jti, refreshPayload, expiresAt);

    res.cookie("refresh_token", newRefreshToken, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 1000,
    });

    res.status(200).json({ accessToken: accessToken });
    return;
  } catch (err) {
    res.status(403).json({ error: "Invalid Refresh Token!" });
    return;
  }
});

export const logoutUser = catchAsync(async (req: Request, res: Response) => {
  const { refresh_token: refreshToken } = matchedData(req);

  if (!refreshToken) {
    res.status(200).json({ error: "No active session." });
    return;
  }

  const decoded = verifyRefreshToken(refreshToken);

  if (!decoded.jti) {
    console.warn("Attempted logout with malformed token.");
  } else {
    try {
      const isTokenRevoked = await revokeRefreshTokenRecord(decoded.jti);

      if (!isTokenRevoked) {
        console.warn("Logout attempt for non-existent JTI:", decoded.jti);
      }
    } catch (err) {
      console.error("Database error during logout revocation:", err);
    }
  }

  res.cookie("refresh_token", "", {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    expires: new Date(0),
  });

  res.status(200).json({ message: "Logout successful." });
  return;
});
