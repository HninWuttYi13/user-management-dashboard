import { z } from "zod";

export const PaginationQuerySchema = z.object({
      page: z
        .string()
        .regex(/^\d+$/, "Page must be a positive number") 
        .transform((val) => parseInt(val, 10)) 
        .pipe(z.number().min(1, "Page must be at least 1")) 
        .optional()
        .default(1), 

      limit: z
        .string()
        .regex(/^\d+$/, "Limit must be a positive number")
        .transform((val) => parseInt(val, 10))
        .pipe(z.number().min(1).max(100, "Limit must be between 1 and 100"))
        .optional()
        .default(10),
    })
    .strict();


    export type PaginationQueryType = z.infer<typeof PaginationQuerySchema>;
