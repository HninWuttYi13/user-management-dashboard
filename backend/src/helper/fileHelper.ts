import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import type { User } from "../types/user.types.js";
import { AppError } from "../utils/AppError.js";

// __dirname is not available in ESM — reconstruct it from import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Absolute path to the JSON data file
const DATA_PATH = path.resolve(__dirname, "../../data/users.json");

// Read and parse all users from the JSON file
export const readUsers = async (): Promise<User[]> => {
  try {
    const rawData = await fs.readFile(DATA_PATH, "utf-8");
    return JSON.parse(rawData) as User[];
  } catch (error: unknown) {
    // ENOENT means file does not exist yet — return empty array as safe default
    if (
      error instanceof Error &&
      (error as NodeJS.ErrnoException).code === "ENOENT"
    ) {
      return [];
    }
    throw new AppError("Error reading data file", 500);
  }
};

// Serialize and write users array back to the JSON file
export const writeUsers = async (users: User[]): Promise<void> => {
  try {
    // null, 2 keeps the JSON human-readable in the file
    await fs.writeFile(DATA_PATH, JSON.stringify(users, null, 2), "utf-8");
  } catch {
    throw new AppError("Error writing to data file", 500);
  }
};
