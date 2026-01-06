import { Request, Response, NextFunction } from "express";
import { matchedData } from "express-validator";
import { createUser, compareHash, findUser } from "../services/user.service";
import { findAddress } from "../services/address.service";
import {
  addRefreshToken,
  deleteRefreshTokenByJti,
  generateAccessToken,
  generateRefreshToken,
  getRefreshTokenByJti,
  getTokenExipry,
  getTokenJti,
  verifyRefreshToken,
} from "../services/token.service";
import env from "../config/env";
import { RoleIdType } from "../constants/roles";

export const registerUser = (roleId: RoleIdType) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      let {
        username,
        email,
        password,
        confirmPassword,
        phoneNumber,
        addressId,
      } = matchedData(req);

      // Removing +977 before sending it to the db
      if (phoneNumber.slice(0, 4) === "+977") {
        phoneNumber = phoneNumber.slice(4).trim();
      }

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

      if (password !== confirmPassword) {
        res.status(400).json({ error: "Password confirmation does not match" });
        return;
      }

      if (!(await findAddress(addressId))) {
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
    } catch (err) {
      next(err);
    }
  };
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { username, password } = matchedData(req);

  try {
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
    const refreshToken = generateRefreshToken(refreshPayload);

    const expiresAt = getTokenExipry(refreshToken);

    if (!expiresAt) {
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    await addRefreshToken(refreshPayload, expiresAt);

    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ accessToken: accessToken });
    return;
  } catch (err) {
    next(err);
  }
};

export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { refresh_token: refreshToken } = matchedData(req);

    if (refreshToken === undefined) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const jti = getTokenJti(refreshToken);

    if (!jti) {
      res.status(401).json({ error: "Invalid Refresh Token Format!" });
      return;
    }

    const storedToken = await getRefreshTokenByJti(jti);

    if (!storedToken) {
      res.status(403).json({ error: "Session Expired! Please log in again." });
      return;
    }

    try {
      const decodedUser = verifyRefreshToken(refreshToken);

      const accessToken = generateAccessToken({
        id: decodedUser.id,
        roleId: decodedUser.roleId,
      });

      res.status(200).json({ accessToken: accessToken });
      return;
    } catch (err) {
      res.status(403).json({ error: "Invalid Refresh Token!" });
      return;
    }
  } catch (err) {
    next(err);
  }
};

export const logoutUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { refresh_token: refreshToken } = matchedData(req);

    if (!refreshToken) {
      res.status(200).json({ error: "No active session." });
      return;
    }

    const jti = getTokenJti(refreshToken);

    if (!jti) {
      console.warn("Attempted logout with malformed token.");
    } else {
      try {
        const isTokenDeleted = await deleteRefreshTokenByJti(jti);

        if (!isTokenDeleted) {
          console.warn("Logout attempt for non-existent JTI:", jti);
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
  } catch (err) {
    console.error("Error registering user: ");
    next(err);
  }
};
