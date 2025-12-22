import { JwtPayload } from "jsonwebtoken";

export interface RefreshTokenPayload extends JwtPayload {
  id: number;
  roleId: number;
  jti: string;
}
