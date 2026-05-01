import cors from "cors";
import express from "express";
import helmet from "helmet";
import { globalErrorHandler } from "./middlewares/errorHandler.js";
import { errorResponse } from "./utils/response.js";

const app = express();

// Security headers — protects against common web vulnerabilities
app.use(helmet());

// Restrict CORS to frontend origin only
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
  }),
);

// Parse incoming JSON and URL-encoded request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes will be mounted here
// app.use('/api/users', userRoutes);

// 404 handler — catches any unmatched routes
app.use((_req, res) => {
  return errorResponse(res, null, "Route Not Found", 404);
});

// Global error handler — must be registered last
app.use(globalErrorHandler);

export { app };
