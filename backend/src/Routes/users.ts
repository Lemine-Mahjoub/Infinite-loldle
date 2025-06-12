import express, { Response } from "express";
import { PrismaClient } from "@prisma/client";
import { getRandomChamps } from "../utils/Champs";
import { authenticateToken, AuthRequest } from "../middleware/auth";

const router = express.Router();
const prisma = new PrismaClient();

// Get all users (leaderboard) - protected route
router.get(
  "/",
  authenticateToken,
  async (_req: AuthRequest, res: Response): Promise<void> => {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          username: true,
          score: true,
          champ: true,
        },
        orderBy: {
          score: "desc",
        },
      });
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Error fetching users" });
    }
  }
);

// Get current user profile - protected route
router.get(
  "/me",
  authenticateToken,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user!.id },
        select: {
          id: true,
          username: true,
          email: true,
          score: true,
          champ: true,
          createdAt: true,
        },
      });

      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      res.json(user);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      res.status(500).json({ error: "Error fetching user profile" });
    }
  }
);

// Check champion answer - protected route
router.post(
  "/check",
  authenticateToken,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { champ, points } = req.body;
      const userId = req.user!.id;

      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      if (user.champ === champ.name) {
        // Correct answer - update score
        const updatedUser = await prisma.user.update({
          where: { id: userId },
          data: { score: user.score + points },
        });

        res.json({
          message: "Correct answer!",
          score: updatedUser.score,
          correct: true,
        });
      } else {
        res.json({
          message: "Incorrect answer",
          score: user.score,
          correct: false,
        });
      }
    } catch (error) {
      console.error("Error checking answer:", error);
      res.status(500).json({ error: "Error checking answer" });
    }
  }
);

// Update user score - protected route
router.put(
  "/score",
  authenticateToken,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { score } = req.body;
      const userId = req.user!.id;

      if (typeof score !== "number" || score < 0) {
        res.status(400).json({ error: "Invalid score value" });
        return;
      }

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { score },
      });

      res.json({
        message: "Score updated successfully",
        score: updatedUser.score,
      });
    } catch (error) {
      console.error("Error updating score:", error);
      res.status(500).json({ error: "Error updating score" });
    }
  }
);

// Get new random champion - protected route
router.post(
  "/new-champion",
  authenticateToken,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user!.id;
      const randomChamp = await getRandomChamps();

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { champ: randomChamp.name },
      });

      res.json({
        message: "New champion assigned",
        champ: updatedUser.champ,
      });
    } catch (error) {
      console.error("Error assigning new champion:", error);
      res.status(500).json({ error: "Error assigning new champion" });
    }
  }
);

export default router;
