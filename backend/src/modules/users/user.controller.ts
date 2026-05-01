import type { NextFunction, Request, Response } from "express";
import type { CreateUserInput, GetAllUserInput } from "./user.schema.js";
import { successResponse } from "../../utils/response.js";
import { createUserService, getAllUserService } from "./user.service.js";

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
    console.error("Controller Error:", error);
    next(error);
  }
};

export const createUser = async(
    req: Request<unknown, CreateUserInput, unknown>,
    res: Response,
    next: NextFunction
)=> {
    try {
        const body = req.body as unknown as CreateUserInput;
        const result = await createUserService(body);
        successResponse(res, result, 'User is created successfully');
    } catch (error) {
        next(error);
    }
}
