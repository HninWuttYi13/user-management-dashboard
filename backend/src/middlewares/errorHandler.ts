import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { AppError } from "../utils/AppError.js";
import { errorResponse } from "../utils/response.js";

// Global error handler — must have exactly 4 parameters for Express to recognize it as error middleware
export const globalErrorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  let statusCode = 500;
  let message = "Internal Server Error";

  // Only expose raw error data in development to prevent leaking internals
  let errorData: unknown =
    process.env.NODE_ENV === "development" ? err : undefined;

  if (err instanceof AppError) {
    // Operational errors we threw intentionally (e.g. user not found, bad request)
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof ZodError) {
    // Zod schema validation failed — return field-level errors to client
    statusCode = 400;
    message = "Validation Error";
    errorData = err.flatten().fieldErrors;
  } else if (err instanceof Error && err.name === "ValidationError") {
    // Catch-all for other named validation errors
    statusCode = 400;
    message = err.message;
  }

  errorResponse(res, errorData, message, statusCode);
};
