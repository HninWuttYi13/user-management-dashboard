import {z} from 'zod';
import { PaginationQuerySchema } from '../../helper/pagination.schema.js';
export const getAllUsersSchema = z.object({
  query: PaginationQuerySchema.extend({
    name: z.string().trim().optional(),
    username: z.string().trim().optional(),
    email: z.string().trim().toLowerCase().optional(),
  }),
});
export type GetAllUserInput = z.infer<typeof getAllUsersSchema>['query'];