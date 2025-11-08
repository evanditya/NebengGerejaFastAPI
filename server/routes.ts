import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { requireAuth, requireRole, type AuthRequest } from "./auth";
import { insertUserSchema, insertMassSchema, insertEnvironmentSchema, insertRideSchema, insertBookingSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/register", async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(validatedData.email);
      if (existingUser) {
        return res.status(400).json({ error: "Email already registered" });
      }

      const user = await storage.createUser(validatedData);
      
      // Auto-login after registration
      req.session.userId = user.id;
      
      // Don't return password hash
      const { passwordHash, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error: any) {
      if (error.name === "ZodError") {
        const validationError = fromZodError(error);
        return res.status(400).json({ error: validationError.message });
      }
      res.status(500).json({ error: "Registration failed" });
    }
  });

  app.post("/api/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password required" });
      }

      const user = await storage.authenticateUser(email, password);
      
      if (!user) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      req.session.userId = user.id;
      
      const { passwordHash, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      res.status(500).json({ error: "Login failed" });
    }
  });

  app.post("/api/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Logout failed" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/me", requireAuth, async (req: AuthRequest, res) => {
    try {
      const user = await storage.getUser(req.session.userId!);
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const { passwordHash, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  // Mass routes
  app.get("/api/masses", async (req, res) => {
    try {
      const masses = await storage.listMasses();
      res.json({ masses });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch masses" });
    }
  });

  app.post("/api/masses", requireAuth, async (req: AuthRequest, res) => {
    try {
      // Only admin can create masses
      if (req.user?.role !== "admin") {
        return res.status(403).json({ error: "Only admins can create mass schedules" });
      }

      const validatedData = insertMassSchema.parse(req.body);
      const mass = await storage.createMass(validatedData);
      res.json({ mass });
    } catch (error: any) {
      if (error.name === "ZodError") {
        const validationError = fromZodError(error);
        return res.status(400).json({ error: validationError.message });
      }
      res.status(500).json({ error: "Failed to create mass" });
    }
  });

  app.delete("/api/masses/:id", requireAuth, async (req: AuthRequest, res) => {
    try {
      if (req.user?.role !== "admin") {
        return res.status(403).json({ error: "Only admins can delete mass schedules" });
      }

      const deleted = await storage.deleteMass(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Mass not found" });
      }
      res.json({ message: "Mass deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete mass" });
    }
  });

  // Environment routes
  app.get("/api/environments", async (req, res) => {
    try {
      const environments = await storage.listEnvironments();
      res.json({ environments });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch environments" });
    }
  });

  app.post("/api/environments", requireAuth, async (req: AuthRequest, res) => {
    try {
      if (req.user?.role !== "admin") {
        return res.status(403).json({ error: "Only admins can create environments" });
      }

      const validatedData = insertEnvironmentSchema.parse(req.body);
      const environment = await storage.createEnvironment(validatedData);
      res.json({ environment });
    } catch (error: any) {
      if (error.name === "ZodError") {
        const validationError = fromZodError(error);
        return res.status(400).json({ error: validationError.message });
      }
      res.status(500).json({ error: "Failed to create environment" });
    }
  });

  app.delete("/api/environments/:id", requireAuth, async (req: AuthRequest, res) => {
    try {
      if (req.user?.role !== "admin") {
        return res.status(403).json({ error: "Only admins can delete environments" });
      }

      const deleted = await storage.deleteEnvironment(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Environment not found" });
      }
      res.json({ message: "Environment deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete environment" });
    }
  });

  // Ride routes
  app.get("/api/rides", async (req, res) => {
    try {
      const massId = req.query.massId as string | undefined;
      const rides = await storage.listRides(massId);
      res.json({ rides });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch rides" });
    }
  });

  app.get("/api/rides/:id", async (req, res) => {
    try {
      const ride = await storage.getRide(req.params.id);
      if (!ride) {
        return res.status(404).json({ error: "Ride not found" });
      }
      res.json({ ride });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch ride" });
    }
  });

  app.post("/api/rides", requireAuth, async (req: AuthRequest, res) => {
    try {
      if (req.user?.role !== "driver" && req.user?.role !== "admin") {
        return res.status(403).json({ error: "Only drivers can create rides" });
      }

      const validatedData = insertRideSchema.parse({
        ...req.body,
        driverId: req.user.id,
      });
      
      const ride = await storage.createRide(validatedData);
      res.json({ ride });
    } catch (error: any) {
      if (error.name === "ZodError") {
        const validationError = fromZodError(error);
        return res.status(400).json({ error: validationError.message });
      }
      res.status(500).json({ error: "Failed to create ride" });
    }
  });

  // Booking routes
  app.get("/api/bookings", requireAuth, async (req: AuthRequest, res) => {
    try {
      const bookings = await storage.listBookingsByPassenger(req.user!.id);
      res.json({ bookings });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch bookings" });
    }
  });

  app.post("/api/bookings", requireAuth, async (req: AuthRequest, res) => {
    try {
      const validatedData = insertBookingSchema.parse({
        ...req.body,
        passengerId: req.user!.id,
      });
      
      const booking = await storage.createBooking(validatedData);
      res.json({ booking });
    } catch (error: any) {
      if (error.name === "ZodError") {
        const validationError = fromZodError(error);
        return res.status(400).json({ error: validationError.message });
      }
      if (error.message === "Ride not found or inactive") {
        return res.status(404).json({ error: error.message });
      }
      if (error.message === "Not enough seats available") {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: "Failed to create booking" });
    }
  });

  app.delete("/api/bookings/:id", requireAuth, async (req: AuthRequest, res) => {
    try {
      // Check if booking belongs to user
      const booking = await storage.getBooking(req.params.id);
      if (!booking) {
        return res.status(404).json({ error: "Booking not found" });
      }

      if (booking.passengerId !== req.user!.id) {
        return res.status(403).json({ error: "Cannot cancel other users' bookings" });
      }

      const deleted = await storage.deleteBooking(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Booking not found" });
      }
      
      res.json({ message: "Booking cancelled successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to cancel booking" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
