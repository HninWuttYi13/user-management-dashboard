import { Router } from "express";
import { validator } from "../../middlewares/validator.js";
import { getAllUsers } from "./user.controller.js";
import { getAllUsersSchema } from "./user.schema.js";

const router = Router();
router.get('/', validator(getAllUsersSchema), getAllUsers);
export {router as userRouter};