import { JwtPayload } from "jsonwebtoken";

export interface AccessTokenPayload extends JwtPayload {
  id: string;
  roleId: string;
}

export interface RefreshTokenPayload extends JwtPayload {
  id: string;
  roleId: string;
  jti: string;
}
