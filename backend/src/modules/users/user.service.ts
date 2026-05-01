import type { Request } from "express";
import { readUsers } from "../../helper/fileHelper.js";
import { generatePaginationData } from "../../helper/paginationHelper.js";
import type { GetAllUserInput } from "./user.schema.js";
import type { User } from "../../types/user.types.js";
import type { PaginationData } from "../../helper/paginationHelper.js";
interface GetAllUsersResult {
    users: User[];
    pagination: PaginationData;
}
//get all user service
export const getAllUserService = async(
    req: Request,
    data: GetAllUserInput
): Promise<GetAllUsersResult> => {
    const {page = 1, limit = 10, name, username, email} = data;
   
    //Read all users from JSON file 
    let users = await readUsers();
    //Apply optional filters- case insensitive contains search
    if(name) {
        users = users.filter((u)=> u.name.toLowerCase().includes(name.toLowerCase()));
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
    //Slice correct page
    const skip = (page -1) * limit;
    const paginated = users.slice(skip, skip + limit);
    //Generate pagination meta and next/prev links
    const pagination = generatePaginationData(req, total, page, limit);
    return {users: paginated, pagination};
}