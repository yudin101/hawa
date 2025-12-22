import { Request, Response, NextFunction, Router } from "express";
import registerRoutes from "./register.route";
import { checkSchema, matchedData } from "express-validator";
import pool from "../config/db";
import bcrypt from "bcrypt";
import { User } from "../types/user";
import jwt from "jsonwebtoken";
import env from "../config/env";
import crypto from "crypto";
import { getTokenExipry, getTokenJti } from "../utils/token.util";
import { RefreshTokenPayload } from "../types/refreshTokenPayload";
import { loginValidation } from "../validators/auth.validator";
import { validate } from "../middlewares/validation.middleware";

const router = Router();

router.use("/register", registerRoutes);

router.post(
  "/login",
  checkSchema(loginValidation),
  validate,
  async (req: Request, res: Response, next: NextFunction) => {
    const { username, password } = matchedData(req);

    try {
      const userCheck = await pool.query(
        `SELECT * FROM users WHERE username = $1`,
        [username],
      );

      const user = userCheck.rows[0] as User;

      if (!user || !(await bcrypt.compare(password, user["password"]))) {
        res.status(401).json({ error: "Invalid Credentials" });
        return;
      }

      const accessPayload = { id: user.id, role: user.roleId };
      const refreshPayload = { id: user.id, jti: crypto.randomUUID() };

      const accessToken = jwt.sign(accessPayload, env.JWT_SECRET, {
        expiresIn: "15m",
      });

      const refreshToken = jwt.sign(refreshPayload, env.JWT_REFRESH_SECRET, {
        expiresIn: "30d",
      });

      const expiresAt = getTokenExipry(refreshToken);

      if (!expiresAt) {
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }

      pool.query(
        `INSERT INTO refresh_tokens (jti, user_id, expires_at) VALUES ($1, $2, $3)`,
        [refreshPayload.jti, refreshPayload.id, expiresAt],
      );

      res.cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      res.status(200).json({ accessToken: accessToken });
      return;
    } catch (err) {
      throw err;
    }
  },
);

router.post(
  "/token",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refreshToken = req.body.token;

      if (refreshToken === undefined) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const jti = getTokenJti(refreshToken);

      if (!jti) {
        res.status(401).json({ error: "Invalid Refresh Token Format!" });
        return;
      }

      const jtiCheck = await pool.query(
        `SELECT * FROM refresh_tokens WHERE jti = $1`,
        [jti],
      );

      if (jtiCheck.rows.length === 0) {
        res
          .status(403)
          .json({ error: "Session Expired! Please log in again." });
        return;
      }

      try {
        const decodedUser = jwt.verify(
          refreshToken,
          env.JWT_REFRESH_SECRET,
        ) as RefreshTokenPayload;

        const accessToken = jwt.sign(
          { id: decodedUser.id, role: decodedUser.roleId },
          env.JWT_SECRET,
          { expiresIn: "15m" },
        );

        res.status(200).json({ accessToken: accessToken });
        return;
      } catch (err) {
        res.status(403).json({ error: "Invalid Refresh Token!" });
        return;
      }
    } catch (err) {
      throw err;
    }
  },
);

router.post(
  "/logout",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refreshToken = req.cookies.refresh_token;

      if (!refreshToken) {
        res.status(200).json({ error: "No active session." });
        return;
      }

      const jti = getTokenJti(refreshToken);

      if (!jti) {
        console.warn("Attempted logout with malformed token.");
      } else {
        try {
          const result = await pool.query(
            `DELETE FROM refresh_tokens WHERE jti = $1`,
            [jti],
          );

          if (result.rowCount === 0) {
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
    } catch (err) {
      throw err;
    }
  },
);

export default router;
