import express from "express";
import environment from "dotenv";
import cors from "cors";

import adminRouter from "./routers/admin.router";
import userRouter from "./routers/user.router";
import authRouter from "./routers/auth.router"; // Import the auth router

import { ErrorHandlerMiddleware } from "./middlewares/error.handler.middleware";

environment.config();

const app = express();
const errorHandler = new ErrorHandlerMiddleware();
const PORT = parseInt(process.env.SERVER_PORT_DEV as string) || 8800;

// Middleware to parse JSON requests
app.use(express.json());

// CORS settings
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:3000", // Adjust or use an environment variable for client origin
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
    credentials: true, // Include credentials like cookies (optional, set true if needed)
  })
);

// Handle preflight requests (OPTIONS)
app.options("*", cors());

// Register routers
app.use("/api/admin", adminRouter);
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter); // Add the auth router

// Error handling middleware
app.use(errorHandler.errorHandler());

// Start the server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Listening on port : ${PORT}`);
});


