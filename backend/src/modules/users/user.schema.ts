import { z } from "zod";
import { PaginationQuerySchema } from "../../helper/pagination.schema.js";
export const getAllUsersSchema = z.object({
  query: PaginationQuerySchema.extend({
    name: z.string().trim().optional(),
    username: z.string().trim().optional(),
    email: z.string().trim().toLowerCase().optional(),
  }),
});
export const createUserSchema = z.object({
  body: z
    .object({
      name: z
        .string("Email is required")
        .trim()
        .min(3, "Name must be at least 3 characters"),

      username: z
        .string("Username is required" )
        .trim()
        .min(3, "Username must be at least 3 characters"),

      email: z
        .string( "Email is required" )
        .trim()
        .email("Invalid email format")
        .transform((val) => val.toLowerCase()),
    })
    .strict(),
});

export type GetAllUserInput = z.infer<typeof getAllUsersSchema>["query"];
export type CreateUserInput = z.infer<typeof createUserSchema>["body"];