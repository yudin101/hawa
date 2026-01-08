export interface User {
  id: string;
  roleId: string;
  username: string;
  password: string;
  phoneNumber: string;
  email: string;
  addressId: number;
  createdAt: string | Date;
  district?: string | undefined;
  municipality?: string | undefined;
  streetName?: string | undefined;
}

interface RequestUser {
  id: string;
  roleId: string;
  iat: number;
  exp: number;
}

declare module "express" {
  interface Request {
    user?: RequestUser;
  }
}

// declare global {
//   namespace Express {
//     interface User extends User { }
//   }
// }
