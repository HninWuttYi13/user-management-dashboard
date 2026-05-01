import type { NextFunction, Request, Response } from "express";
import type { GetAllUserInput } from "./user.schema.js";
import { successResponse } from "../../utils/response.js";
import { getAllUserService } from "./user.service.js";

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
