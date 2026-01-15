import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync.util";
import { matchedData } from "express-validator";
import {
  insertAddress,
  findAddress,
  fuzzyFindAddress,
} from "../services/address.service";
import { generateSetClauses } from "../utils/generateSetClauses.util";
import { removeById, updateInfo } from "../services/common.service";
import { compareHash } from "../services/auth.service";

export const searchAddress = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { searchTerm, page, limit } = matchedData(req);

    const searchResults = await fuzzyFindAddress(searchTerm, page, limit);

    res.status(200).json(searchResults);
    return;
  },
);

export const addAddress = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { district, municipality, streetName } = matchedData(req);

    if (await findAddress("other", { district, municipality, streetName })) {
      res.status(400).json({ error: "Address already exists" });
      return;
    }

    const addedAddress = await insertAddress({
      district,
      municipality,
      streetName,
    });

    res
      .status(201)
      .json({ message: "Address added Successfully", address: addedAddress });
    return;
  },
);

export const updateAddress = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const {
      id: addressId,
      district,
      municipality,
      streetName,
      confirmationPassword,
    } = matchedData(req);
    const currentUserId: string = req.user?.id as string;

    if (!(await compareHash(confirmationPassword, currentUserId))) {
      res.status(401).json({ error: "Invalid Credentials" });
      return;
    }

    if (!(await findAddress("id", { addressId }))) {
      res.status(404).json({ error: "Address Not Found" });
      return;
    }

    const { setClauses, queryValues } = generateSetClauses(
      ["id", "district", "municipality", "street_name"],
      [addressId, district, municipality, streetName],
    );

    if (setClauses.length === 0) {
      res.status(400).json({ error: "No fields provided" });
      return;
    }

    const updatedAddress = await updateInfo(
      "addresses",
      setClauses,
      queryValues,
    );

    res
      .status(200)
      .json({ message: "Address Updates", address: updatedAddress });
    return;
  },
);

export const deleteAddress = catchAsync(async (req: Request, res: Response) => {
  const { id: addressId, confirmationPassword } = matchedData(req);
  const currentUserId: string = req.user?.id as string;

  if (!(await compareHash(confirmationPassword, currentUserId))) {
    res.status(401).json({ error: "Invalid Credentials" });
    return;
  }

  if (!(await findAddress("id", { addressId }))) {
    res.status(404).json({ error: "Address Not Found" });
    return;
  }

  await removeById("addresses", addressId);

  res.status(200).json({ message: "Address removed" });
  return;
});
