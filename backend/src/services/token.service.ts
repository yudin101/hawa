import jwt from "jsonwebtoken";
import pool from "../config/db";

export const addRefreshToken = async (
  refreshPayload: { id: string; jti: string },
  expiresAt: Date,
) => {
  await pool.query(
    `INSERT INTO refresh_tokens (jti, user_id, expires_at) 
      VALUES ($1, $2, $3)`,
    [refreshPayload.jti, refreshPayload.id, expiresAt],
  );
};

export const getRefreshTokenByJti = async (jti: string) => {
  const result = await pool.query(
    `SELECT * FROM refresh_tokens WHERE jti = $1`,
    [jti],
  );
  return result.rows[0];
};

export const deleteRefreshTokenByJti = async (jti: string) => {
  const result = await pool.query(`DELETE FROM refresh_tokens WHERE jti = $1`, [
    jti,
  ]);
  return (result.rowCount ?? 0) > 0;
};

export const getTokenExipry = (token: string): Date | undefined => {
  const decodedPayload = jwt.decode(token);

  if (
    decodedPayload &&
    typeof decodedPayload === "object" &&
    "exp" in decodedPayload
  ) {
    const expTimestamp = decodedPayload.exp;

    if (expTimestamp) {
      const expiryDate = new Date(expTimestamp * 1000);
      return expiryDate;
    }
  }

  return undefined;
};

export const getTokenJti = (token: string): string | undefined => {
  const decodedPayload = jwt.decode(token);

  if (
    decodedPayload &&
    typeof decodedPayload === "object" &&
    "jti" in decodedPayload
  ) {
    return decodedPayload.jti as string;
  }

  return undefined;
};
