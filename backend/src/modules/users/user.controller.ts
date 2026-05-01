import type { NextFunction, Request, Response } from "express";
import type {
  CreateUserInput,
  GetAllUserInput,
  IdParamsInput,
} from "./user.schema.js";
import { successResponse } from "../../utils/response.js";
import {
  createUserService,
  getAllUserService,
  getUserByIdService,
} from "./user.service.js";
import type { UserIdParam } from "../../types/idParams.types.js";

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // Cast req.query — Zod validator already transformed and validated it
    const query = req.query as unknown as GetAllUserInput;

    const result = await getAllUserService(req, query);

    successResponse(res, result, "Users fetched successfully");
  } catch (error) {
    next(error);
  }
};

export const createUser = async (
  req: Request<unknown, CreateUserInput, unknown>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const body = req.body as unknown as CreateUserInput;
    const result = await createUserService(body);
    successResponse(res, result, "User is created successfully");
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (
  req: Request<UserIdParam>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.params as unknown as IdParamsInput;
    const result = await getUserByIdService(id);
    successResponse(res, result, "User retrieved successfully");
  } catch (error) {
    next(error);
  }
};
