export interface User {
  id: number;
  roleId: number;
  username: string;
  password: string;
  phoneNumber: string;
  email: string;
  addressId: number;
  createdAt: string | Date;
}

declare module "express" {
  interface Request {
    user?: User;
  }
}

declare global {
  namespace Express {
    interface User extends User { }
  }
}
