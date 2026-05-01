import { Router } from "express";
import { validator } from "../../middlewares/validator.js";
import { createUser, getAllUsers, getUserById, updateUser } from "./user.controller.js";
import { createUserSchema, getAllUsersSchema, idParamSchema, updateUserSchema } from "./user.schema.js";

const router = Router();
router.get('/', validator(getAllUsersSchema), getAllUsers);
router.post('/', validator(createUserSchema), createUser);
router.get('/:id', validator(idParamSchema), getUserById);
router.put("/:id", validator(updateUserSchema), updateUser);
export {router as userRouter};