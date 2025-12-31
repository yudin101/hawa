export interface User {
  id: number;
  roleId: string;
  username: string;
  password: string;
  phoneNumber: string;
  email: string;
  addressId: number;
  createdAt: string | Date;
}

interface RequestUser {
  id: string;
  role: string;
  iat: number;
  exp: number
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
