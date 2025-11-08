import { Request, Response, NextFunction } from "express";
import type { User } from "@shared/schema";

// Extend Express Request type to include session user
declare module "express-session" {
  interface SessionData {
    userId?: string;
  }
}

export interface AuthRequest extends Request {
  user?: User;
}

// Middleware to check if user is authenticated
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Authentication required" });
  }
  next();
}

// Middleware to check if user has a specific role
export function requireRole(...roles: string[]) {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    if (!req.user) {
      return res.status(401).json({ error: "User not found" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }

    next();
  };
}

// Middleware to attach user to request if logged in
export async function attachUser(req: AuthRequest, res: Response, next: NextFunction) {
  if (req.session.userId) {
    const { storage } = await import("./storage");
    const user = await storage.getUser(req.session.userId);
    if (user) {
      req.user = user;
    }
  }
  next();
}
