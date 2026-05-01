import dotenv from "dotenv";
import { app } from "./app.js";
dotenv.config();
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
//Graceful shutdown logic
const gracefulShutdown = () => {
  server.close(() => {
    console.log("User Management Dashboard API is closed");
    process.exit(0);
  });
};
process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);
