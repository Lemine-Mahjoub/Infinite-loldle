import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import usersRoutes from "./Routes/users";
import authRoutes from "./Routes/auth";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173", // Vite dev server (old front)
      "http://localhost:3001", // Next.js dev server (lodle-game)
      "http://localhost:3000", // In case frontend runs on 3000
      process.env.FRONTEND_URL || "http://localhost:5173",
    ],
    credentials: true,
  })
);
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/users", usersRoutes);

// Health check endpoint
app.get("/health", (_req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Available routes:`);
  console.log(`  POST /auth/register - User registration`);
  console.log(`  POST /auth/login - User login`);
  console.log(`  GET /auth/verify - Verify token`);
  console.log(`  POST /auth/refresh - Refresh token`);
  console.log(`  GET /users - Get leaderboard (protected)`);
  console.log(`  GET /users/me - Get user profile (protected)`);
  console.log(`  POST /users/check - Check champion answer (protected)`);
  console.log(`  PUT /users/score - Update score (protected)`);
  console.log(`  POST /users/new-champion - Get new champion (protected)`);
  console.log(`  GET /health - Health check`);
});
