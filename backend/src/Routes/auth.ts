import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getRandomChamps } from "../utils/Champs";

const router = express.Router();
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const JWT_EXPIRY = "7d"; // Token valid for 7 days

interface AuthRequest extends Request {
  user?: {
    id: number;
    username: string;
    email: string;
  };
}

interface JWTPayload extends jwt.JwtPayload {
  userId: number;
  username: string;
  email: string;
}

// Register route
router.post("/register", async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password } = req.body;

    // Validation
    if (!username || !email || !password) {
      res.status(400).json({
        error: "Username, email, and password are required",
      });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({
        error: "Password must be at least 6 characters long",
      });
      return;
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
    });

    if (existingUser) {
      res.status(409).json({
        error:
          existingUser.username === username
            ? "Username already exists"
            : "Email already exists",
      });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    const randomChamp = await getRandomChamps();

    // Create user
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        champ: randomChamp.name,
        score: 0,
      },
    });

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        username: user.username,
        email: user.email,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRY }
    );

    // Return user data without password
    res.status(201).json({
      message: "User created successfully",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        score: user.score,
        champ: user.champ,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Login route
router.post("/login", async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    // Validation
    if (!username || !password) {
      res.status(400).json({
        error: "Username and password are required",
      });
      return;
    }

    // Find user by username or email
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { username },
          { email: username }, // Allow login with email
        ],
      },
    });

    if (!user) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        username: user.username,
        email: user.email,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRY }
    );

    // Return user data without password
    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        score: user.score,
        champ: user.champ,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Verify token route (for frontend to check if token is still valid)
router.get(
  "/verify",
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const token = req.header("Authorization")?.replace("Bearer ", "");

      if (!token) {
        res.status(401).json({ error: "No token provided" });
        return;
      }

      const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;

      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          username: true,
          email: true,
          score: true,
          champ: true,
        },
      });

      if (!user) {
        res.status(401).json({ error: "User not found" });
        return;
      }

      res.json({
        valid: true,
        user,
      });
    } catch {
      res.status(401).json({ error: "Invalid token" });
    }
  }
);

// Refresh token route
router.post(
  "/refresh",
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const token = req.header("Authorization")?.replace("Bearer ", "");

      if (!token) {
        res.status(401).json({ error: "No token provided" });
        return;
      }

      const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;

      // Generate new token
      const newToken = jwt.sign(
        {
          userId: decoded.userId,
          username: decoded.username,
          email: decoded.email,
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRY }
      );

      res.json({
        message: "Token refreshed",
        token: newToken,
      });
    } catch {
      res.status(401).json({ error: "Invalid token" });
    }
  }
);

export default router;
