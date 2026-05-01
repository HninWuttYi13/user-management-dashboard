import { Router } from "express";
import { validator } from "../../middlewares/validator.js";
import { createUser, getAllUsers } from "./user.controller.js";
import { createUserSchema, getAllUsersSchema } from "./user.schema.js";

const router = Router();
router.get('/', validator(getAllUsersSchema), getAllUsers);
router.post('/', validator(createUserSchema), createUser);
export {router as userRouter};