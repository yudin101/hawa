import { NextFunction, Request, Response } from "express";

export const authTag = (req: Request, res: Response, next: NextFunction) => {
  /* #swagger.tags = ['Auth'] */
  next();
};

export const userTag = (req: Request, res: Response, next: NextFunction) => {
  /* #swagger.tags = ['User'] */
  next();
};

export const addressTag = (req: Request, res: Response, next: NextFunction) => {
  /* #swagger.tags = ['Address'] */
  next();
};

export const categoryTag = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  /* #swagger.tags = ['Category'] */
  next();
};

export const productTag = (req: Request, res: Response, next: NextFunction) => {
  /* #swagger.tags = ['Product'] */
  next();
};

export const cartTag = (req: Request, res: Response, next: NextFunction) => {
  /* #swagger.tags = ['Cart'] */
  next();
};

export const orderTag = (req: Request, res: Response, next: NextFunction) => {
  /* #swagger.tags = ['Order'] */
  next();
};
