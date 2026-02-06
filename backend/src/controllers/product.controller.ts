import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync.util";
import { matchedData } from "express-validator";
import {
  getProducts,
  fuzzyFindProduct,
  findProduct,
  findProductsByColumn,
  insertProduct,
} from "../services/product.service";
import { findCategory } from "../services/category.service";
import { ROLES } from "../constants/roles";
import { findUser } from "../services/user.service";
import { compareHash } from "../services/auth.service";
import { removeById, updateInfo } from "../services/common.service";
import { generateSetClauses } from "../utils/generateSetClauses.util";

export const searchProduct = catchAsync(async (req: Request, res: Response) => {
  const { searchTerm, page, limit } = matchedData(req);
  let productResult;

  if (searchTerm) {
    productResult = await fuzzyFindProduct(searchTerm, page, limit);
  } else {
    productResult = await getProducts(page, limit);
  }

  res.status(200).json(productResult);
  return;
});

export const getProduct = catchAsync(async (req: Request, res: Response) => {
  const { id } = matchedData(req);

  const result = await findProduct({ id });

  if (!result) {
    res.status(404).json({ error: "Product Not Found" });
    return;
  }

  res.status(200).json(result);
  return;
});

export const getSellerProducts = catchAsync(
  async (req: Request, res: Response) => {
    const { username, limit, page } = matchedData(req);

    const fetchedUser = await findUser("username", username);

    if (!fetchedUser || fetchedUser.roleId !== ROLES.SELLER) {
      res.status(404).json({ error: "User Not Found" });
      return;
    }

    const sellerId = fetchedUser.id;

    const result = await findProductsByColumn(sellerId, "seller", limit, page);

    res.status(200).json(result);
    return;
  },
);

export const getCategoryProducts = catchAsync(
  async (req: Request, res: Response) => {
    const { category, limit, page } = matchedData(req);

    const fetchedCateogry = await findCategory({ category });

    if (!fetchedCateogry) {
      res.status(404).json({ error: "Category Not Found" });
      return;
    }

    const categoryId = fetchedCateogry.id;

    const result = await findProductsByColumn(
      categoryId,
      "category",
      limit,
      page,
    );

    res.status(200).json(result);
    return;
  },
);

export const addProduct = catchAsync(async (req: Request, res: Response) => {
  const {
    name,
    pictureUrl,
    body,
    categoryId,
    sellerId,
    availableUnits,
    price,
  } = matchedData(req);
  const currentUserId = req.user!.id;
  const currentUserRoleId = req.user!.roleId;
  let targetUserId = currentUserId;

  if (!(await findCategory({ categoryId }))) {
    res.status(404).json({ error: "Category Not Found" });
    return;
  }

  if (!sellerId && currentUserRoleId === ROLES.ADMIN) {
    res.status(400).json({ error: "Admin must provide sellerID" });
    return;
  }

  if (sellerId && currentUserRoleId === ROLES.ADMIN) {
    const passedUser = await findUser("id", sellerId);

    if (!passedUser) {
      res.status(404).json({ error: "Seller Not Found" });
      return;
    }

    if (passedUser.roleId === ROLES.SELLER) {
      targetUserId = sellerId;
    } else {
      res.status(403).json({ error: "User Not Seller" });
      return;
    }
  }

  const fetchedProduct = await findProduct({ name, targetUserId });

  if (
    fetchedProduct &&
    fetchedProduct.sellerId === targetUserId &&
    fetchedProduct.name === name
  ) {
    res.status(409).json({ error: "Product Already Exists" });
    return;
  }

  const addedProduct = await insertProduct({
    name,
    pictureUrl,
    body,
    categoryId,
    targetUserId,
    availableUnits,
    price,
  });

  res
    .status(201)
    .json({ message: "Product Added Succesfully", product: addedProduct });
  return;
});

export const updateProduct = catchAsync(async (req: Request, res: Response) => {
  const {
    id,
    name,
    pictureUrl,
    body,
    categoryId,
    sellerId,
    availableUnits,
    price,
    confirmationPassword,
  } = matchedData(req);
  const currentUserId: string = req.user!.id;
  const currentUserRoleId: string = req.user!.roleId;
  let targetUserId;

  if (!(await compareHash(confirmationPassword, currentUserId))) {
    res.status(401).json({ error: "Invalid Credentials" });
    return;
  }

  if (categoryId && !(await findCategory({ categoryId }))) {
    res.status(404).json({ error: "Category Not Found" });
    return;
  }

  if (sellerId && currentUserRoleId === ROLES.ADMIN) {
    const passedUser = await findUser("id", sellerId);

    if (!passedUser) {
      res.status(404).json({ error: "Seller Not Found" });
      return;
    }

    if (passedUser.roleId === ROLES.SELLER) {
      targetUserId = sellerId;
    } else {
      res.status(403).json({ error: "User Not Seller" });
      return;
    }
  }

  const fetchedProduct = await findProduct({ id });

  if (!fetchedProduct) {
    res.status(404).json({ error: "Product Not Found" });
    return;
  }

  if (!targetUserId) {
    targetUserId = fetchedProduct.sellerId;
  }

  if (
    fetchedProduct.sellerId !== currentUserId &&
    currentUserRoleId !== ROLES.ADMIN
  ) {
    res.status(403).json({ error: "Not Your Product" });
    return;
  }

  const { setClauses, queryValues } = generateSetClauses(
    [
      "id",
      "name",
      "picture_url",
      "body",
      "category_id",
      "seller_id",
      "available_units",
      "price",
    ],
    [
      id,
      name,
      pictureUrl,
      body,
      categoryId,
      targetUserId,
      availableUnits,
      price,
    ],
  );

  if (setClauses.length === 0) {
    res.status(400).json({ error: "No Fields Provided" });
    return;
  }

  const updatedProduct = await updateInfo("products", setClauses, queryValues);

  res.status(200).json({
    message: "Product Updated",
    product: updatedProduct,
  });
  return;
});

export const deleteProduct = catchAsync(async (req: Request, res: Response) => {
  const { id, confirmationPassword } = matchedData(req);
  const currentUserId: string = req.user!.id;
  const currentUserRoleId: string = req.user!.roleId;

  if (!(await compareHash(confirmationPassword, currentUserId))) {
    res.status(401).json({ error: "Invalid Credentials" });
    return;
  }

  const fetchedProduct = await findProduct({ id });

  if (!fetchedProduct) {
    res.status(404).json({ error: "Product Not Found" });
    return;
  }

  if (
    fetchedProduct.sellerId !== currentUserId &&
    currentUserRoleId !== ROLES.ADMIN
  ) {
    res.status(403).json({ error: "Not Your Product" });
    return;
  }

  await removeById("products", id);

  res.status(200).json({ message: "Product Deleted" });
  return;
});
