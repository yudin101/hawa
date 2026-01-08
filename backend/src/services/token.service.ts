import jwt from "jsonwebtoken";
import pool from "../config/db";
import { env } from "process";
import { AccessTokenPayload, RefreshTokenPayload } from "../types/token";

export const generateAccessToken = (accessPayload: AccessTokenPayload) => {
  return jwt.sign(accessPayload, env.JWT_SECRET, { expiresIn: "15m" });
};

export const generateRefreshToken = (refreshPayload: RefreshTokenPayload) => {
  const expiresInSeconds = 30 * 24 * 60 * 60;

  const refreshToken = jwt.sign(refreshPayload, env.JWT_REFRESH_SECRET, {
    expiresIn: expiresInSeconds,
  });

  const expiresAt = new Date(Date.now() + expiresInSeconds * 1000);

  return { refreshToken, expiresAt };
};

export const addRefreshTokenRecord = async (
  refreshPayload: { id: string; jti: string },
  expiresAt: Date,
) => {
  await pool.query(
    `INSERT INTO refresh_tokens (jti, user_id, expires_at) 
    VALUES ($1, $2, $3)`,
    [refreshPayload.jti, refreshPayload.id, expiresAt],
  );
};

export const verifyRefreshToken = (
  refreshToken: string,
): RefreshTokenPayload => {
  return jwt.verify(
    refreshToken,
    env.JWT_REFRESH_SECRET,
  ) as RefreshTokenPayload;
};

export const findStoredToken = async (jti: string) => {
  const result = await pool.query(
    `SELECT * FROM refresh_tokens WHERE jti = $1`,
    [jti],
  );
  return result.rows[0];
};

export const revokeRefreshTokenRecord = async (jti: string) => {
  const result = await pool.query(`DELETE FROM refresh_tokens WHERE jti = $1`, [
    jti,
  ]);
  return (result.rowCount ?? 0) > 0;
};

export const replaceRefreshTokenRecord = async (
  jti: string,
  refreshPayload: RefreshTokenPayload,
  expiresAt: Date,
) => {
  const client = await pool.connect();

  try {
    await client.query(`BEGIN`);

    await client.query(`DELETE FROM refresh_tokens WHERE jti = $1`, [jti]);

    await client.query(
      `INSERT INTO refresh_tokens (jti, user_id, expires_at)
      VALUES ($1, $2, $3)`,
      [refreshPayload.jti, refreshPayload.id, expiresAt],
    );

    await client.query(`COMMIT`);
  } catch (err) {
    await client.query(`ROLLBACK`);
    throw err;
  } finally {
    client.release();
  }
};
