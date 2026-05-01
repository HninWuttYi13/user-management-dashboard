import type { NextFunction, Request, Response } from "express";
import type {
  CreateUserInput,
  GetAllUserInput,
  IdParamsInput,
  UpdateUserBodyInput,
} from "./user.schema.js";
import { successResponse } from "../../utils/response.js";
import {
  createUserService,
  deleteUserService,
  getAllUserService,
  getUserByIdService,
  updateUserService,
} from "./user.service.js";

// GET /api/users — returns paginated and filtered user list
export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const query = req.query as unknown as GetAllUserInput;
    const result = await getAllUserService(req, query);
    successResponse(res, result, "Users fetched successfully");
  } catch (error) {
    next(error);
  }
};

// POST /api/users — creates a new user, returns 201
export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const body = req.body as unknown as CreateUserInput;
    const result = await createUserService(body);
    successResponse(res, result, "User created successfully", 201);
  } catch (error) {
    next(error);
  }
};

// GET /api/users/:id — returns single user by UUID
export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const params = req.params as unknown as IdParamsInput;
    const result = await getUserByIdService(params);
    successResponse(res, result, "User retrieved successfully");
  } catch (error) {
    next(error);
  }
};

// PUT /api/users/:id — updates user fields, returns updated user
export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const params = req.params as unknown as IdParamsInput;
    const body = req.body as unknown as UpdateUserBodyInput;
    const result = await updateUserService(params, body);
    successResponse(res, result, "User updated successfully");
  } catch (error) {
    next(error);
  }
};

// DELETE /api/users/:id — deletes user, returns success message
export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const params = req.params as unknown as IdParamsInput;
    await deleteUserService(params);
    successResponse(res, null, "User deleted successfully");
  } catch (error) {
    next(error);
  }
};
