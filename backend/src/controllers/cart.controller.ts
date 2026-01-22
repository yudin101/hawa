import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync.util";
import { findUser } from "../services/user.service";
import { findCart, createCart, insertToCart, removeFromCart } from "../services/cart.service";
import { matchedData } from "express-validator";
import { findProduct } from "../services/product.service";

export const getCart = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id as string;

  if (!(await findUser("id", userId))) {
    res.status(404).json({ error: "User Not Found" });
    return;
  }

  const result = await findCart(userId);

  res.status(200).json(result);
  return;
});

export const addToCart = catchAsync(async (req: Request, res: Response) => {
  const { productId, quantity } = matchedData(req);
  const userId = req.user?.id as string;

  const fetchedProduct = await findProduct({ id: productId });
  if (!fetchedProduct) {
    res.status(404).json({ error: "Product Not Found" });
    return;
  }

  const availableUnits = fetchedProduct.availableUnits;

  if (Number(availableUnits) === 0) {
    res.status(400).json({ error: "Product Out of Stock" });
    return;
  } else if (Number(quantity) > Number(availableUnits)) {
    res
      .status(400)
      .json({ error: `Only ${fetchedProduct.availableUnits} units available` });
    return;
  }

  const { id: cartId } = await createCart(userId);
  const fetchedCart = await findCart(userId);

  const productExists = fetchedCart.find(
    (item) => item.productId === productId,
  );

  if (productExists) {
    res.status(409).json({ error: "Product Already Exists in Cart" });
    return;
  }

  const addedItem = await insertToCart({ productId, quantity, cartId });

  res.status(200).json({ addedItem: addedItem });
  return;
});

export const deleteFromCart = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user?.id as string;
    const { productId } = matchedData(req);

    const fetchedProduct = await findProduct({ id: productId });
    if (!fetchedProduct) {
      res.status(404).json({ error: "Product Not Found" });
      return;
    }

    const fetchedCart = await findCart(userId);
    const cartId = fetchedCart[0]?.cartId as string;

    const productExists = fetchedCart.find(
      (item) => item.productId === productId,
    );

    if (!productExists) {
      res.status(404).json({ error: "Product Not Found in Cart" });
      return;
    }

    await removeFromCart({ productId, cartId });

    res.status(200).json({ message: "Product Removed from Cart" });
    return;
  },
);
