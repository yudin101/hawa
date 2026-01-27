import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync.util";
import { matchedData } from "express-validator";
import {
  findCategory,
  fuzzyFindCategory,
  getCategory,
  insertCategory,
} from "../services/category.service";
import { compareHash } from "../services/auth.service";
import { generateSetClauses } from "../utils/generateSetClauses.util";
import { removeById, updateInfo } from "../services/common.service";

export const searchCategory = catchAsync(
  async (req: Request, res: Response) => {
    const { searchTerm, page, limit } = matchedData(req);
    let categoryResults;

    if (searchTerm) {
      categoryResults = await fuzzyFindCategory(searchTerm, page, limit);
    } else {
      categoryResults = await getCategory(page, limit);
    }

    res.status(200).json(categoryResults);
  },
);

export const addCategory = catchAsync(async (req: Request, res: Response) => {
  const { category } = matchedData(req);

  if (await findCategory({ category })) {
    res.status(400).json({
      error: "Category already exists",
    });
    return;
  }

  const addedCategory = await insertCategory(category);

  res.status(201).json({
    message: "Category Added Successfully",
    category: addedCategory,
  });
});

export const updateCategory = catchAsync(
  async (req: Request, res: Response) => {
    const { id: categoryId, category, confirmationPassword } = matchedData(req);
    const currentUserId: string = req.user!.id;

    if (!(await compareHash(confirmationPassword, currentUserId))) {
      res.status(401).json({ error: "Invalid Credentials" });
      return;
    }

    if (!(await findCategory({ categoryId }))) {
      res.status(404).json({ error: "Category Not Found" });
      return;
    }

    const { setClauses, queryValues } = generateSetClauses(
      ["id", "category"],
      [categoryId, category],
    );

    const updatedCategory = await updateInfo(
      "categories",
      setClauses,
      queryValues,
    );

    res
      .status(200)
      .json({ message: "Category Updated", category: updatedCategory });
    return;
  },
);

export const deleteCategory = catchAsync(
  async (req: Request, res: Response) => {
    const { id: categoryId, confirmationPassword } = matchedData(req);
    const currentUserId: string = req.user!.id;

    if (!(await compareHash(confirmationPassword, currentUserId))) {
      res.status(401).json({ error: "Invalid Credentials" });
      return;
    }

    if (!(await findCategory({ categoryId }))) {
      res.status(404).json({ error: "Category Not Found" });
      return;
    }

    await removeById("categories", categoryId);

    res.status(200).json({ message: "Category Deleted" });
    return;
  },
);
