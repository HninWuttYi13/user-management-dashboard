import type { Request } from "express";
import { readUsers, writeUsers } from "../../helper/fileHelper.js";
import { generatePaginationData } from "../../helper/paginationHelper.js";
import type {
  CreateUserInput,
  GetAllUserInput,
  IdParamsInput,
  UpdateUserBodyInput,
} from "./user.schema.js";
import type {  User } from "../../types/user.types.js";
import type { PaginationData } from "../../helper/paginationHelper.js";
import { AppError } from "../../utils/AppError.js";
interface GetAllUsersResult {
  users: User[];
  pagination: PaginationData;
}
//get all user service
export const getAllUserService = async (
  req: Request,
  data: GetAllUserInput,
): Promise<GetAllUsersResult> => {
  const { page = 1, limit = 10, name, username, email } = data;

  //Read all users from JSON file
  let users = await readUsers();
  //Apply optional filters- case insensitive contains search
  if (name) {
    users = users.filter((u) =>
      u.name.toLowerCase().includes(name.toLowerCase()),
    );
  }
  if (username) {
    users = users.filter((u) =>
      u.username.toLowerCase().includes(username.toLowerCase()),
    );
  }

  if (email) {
    users = users.filter((u) =>
      u.email.toLowerCase().includes(email.toLowerCase()),
    );
  }
  //Total count after filtering
  const total = users.length;
  // Sort alphabetically by name before paginating
  users = users.sort((a, b) => a.name.localeCompare(b.name));

  //Slice correct page
  const skip = (page - 1) * limit;
  const paginated = users.slice(skip, skip + limit);
  //Generate pagination meta and next/prev links
  const pagination = generatePaginationData(req, total, page, limit);
  return { users: paginated, pagination };
};;
//create user service
export const createUserService = async (
  data: CreateUserInput,
): Promise<User> => {
  const users = await readUsers();
  // Check for existing email — 409 Conflict is correct status
  const isEmailExist = users.find((u) => u.email === data.email);
  if (isEmailExist) throw new AppError("Email already exists", 409);

  // Check for existing username — usernames must also be unique
  const isUsernameExist = users.find((u) => u.username === data.username);
  if (isUsernameExist) throw new AppError("Username already exists", 409);
  const newUser: User = {
    id: crypto.randomUUID(), // generate Unique ID
    ...data,
  };
  users.push(newUser);
  await writeUsers(users); //store in json file

  return newUser;
};
//getUserById service
export const getUserByIdService = async (
  data: IdParamsInput,
): Promise<User> => {
  const users = await readUsers();
  const user = users.find((u) => u.id === data.id);
  if (!user) throw new AppError("User is not found", 404);
  return user;
};
//update user service
export const updateUserService = async (
  id: IdParamsInput,
  body: UpdateUserBodyInput,
): Promise<User> => {
  const users = await readUsers();

  // Find existing user — throw 404 if not found
  const existingUser = users.find((u) => u.id === id.id);
  if (!existingUser) throw new AppError("User not found", 404);

  // Check email conflict — ignore current user's own email
  if (body.email) {
    const emailExists = users.find(
      (u) => u.email === body.email && u.id !== id.id,
    );
    if (emailExists) throw new AppError("Email already exists", 409);
  }

  // Check username conflict — ignore current user's own username
  if (body.username) {
    const usernameExists = users.find(
      (u) => u.username === body.username && u.id !== id.id,
    );
    if (usernameExists) throw new AppError("Username already exists", 409);
  }

  // Merge existing with updated fields
  const updatedUser: User = { ...existingUser, ...body };
  const updatedUsers = users.map((u) => (u.id === id.id ? updatedUser : u));

  await writeUsers(updatedUsers);
  return updatedUser;
};
//delete user service
export const deleteUserService =  async(data: IdParamsInput): Promise<void> => {
    const users = await readUsers();

    // Check user exists before attempting delete
    const existingUser = users.find((u) => u.id === data.id);
    if (!existingUser) throw new AppError("User not found", 404);

    // Filter out deleted user and write back to file
    const updatedUsers = users.filter((u) => u.id !== data.id);
    await writeUsers(updatedUsers);
}