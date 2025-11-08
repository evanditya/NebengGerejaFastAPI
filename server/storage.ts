import { randomUUID } from "crypto";
import type { 
  User, InsertUser, 
  Mass, InsertMass,
  Environment, InsertEnvironment,
  Ride, InsertRide,
  Booking, InsertBooking
} from "@shared/schema";
import { users, masses, environments, rides, bookings } from "@shared/schema";
import bcrypt from "bcrypt";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";

const SALT_ROUNDS = 10;

export interface IStorage {
  // User operations
  createUser(user: InsertUser): Promise<User>;
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  authenticateUser(email: string, password: string): Promise<User | null>;
  
  // Mass operations
  createMass(mass: InsertMass): Promise<Mass>;
  getMass(id: string): Promise<Mass | undefined>;
  listMasses(): Promise<Mass[]>;
  updateMass(id: string, data: Partial<InsertMass>): Promise<Mass | undefined>;
  deleteMass(id: string): Promise<boolean>;
  
  // Environment operations
  createEnvironment(env: InsertEnvironment): Promise<Environment>;
  getEnvironment(id: string): Promise<Environment | undefined>;
  listEnvironments(): Promise<Environment[]>;
  deleteEnvironment(id: string): Promise<boolean>;
  
  // Ride operations
  createRide(ride: InsertRide): Promise<Ride>;
  getRide(id: string): Promise<Ride | undefined>;
  listRides(massId?: string): Promise<Ride[]>;
  updateRideSeats(id: string, seatsAvailable: number): Promise<Ride | undefined>;
  updateRideStatus(id: string, status: string): Promise<Ride | undefined>;
  
  // Booking operations
  createBooking(booking: InsertBooking): Promise<Booking>;
  getBooking(id: string): Promise<Booking | undefined>;
  listBookingsByPassenger(passengerId: string): Promise<Booking[]>;
  listBookingsByRide(rideId: string): Promise<Booking[]>;
  deleteBooking(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private masses: Map<string, Mass>;
  private environments: Map<string, Environment>;
  private rides: Map<string, Ride>;
  private bookings: Map<string, Booking>;

  constructor() {
    this.users = new Map();
    this.masses = new Map();
    this.environments = new Map();
    this.rides = new Map();
    this.bookings = new Map();
  }

  // User operations
  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const passwordHash = await bcrypt.hash(insertUser.password, SALT_ROUNDS);
    
    const user: User = {
      id,
      name: insertUser.name,
      email: insertUser.email,
      phone: insertUser.phone,
      lingkungan: insertUser.lingkungan ?? null,
      role: insertUser.role ?? "passenger",
      passwordHash,
      createdAt: new Date(),
    };
    
    this.users.set(id, user);
    return user;
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email
    );
  }

  async authenticateUser(email: string, password: string): Promise<User | null> {
    const user = await this.getUserByEmail(email);
    if (!user) return null;
    
    const isValid = await bcrypt.compare(password, user.passwordHash);
    return isValid ? user : null;
  }

  // Mass operations
  async createMass(insertMass: InsertMass): Promise<Mass> {
    const id = randomUUID();
    const mass: Mass = {
      id,
      name: insertMass.name,
      datetime: insertMass.datetime,
      special: insertMass.special ?? false,
    };
    this.masses.set(id, mass);
    return mass;
  }

  async getMass(id: string): Promise<Mass | undefined> {
    return this.masses.get(id);
  }

  async listMasses(): Promise<Mass[]> {
    return Array.from(this.masses.values()).sort(
      (a, b) => a.datetime.getTime() - b.datetime.getTime()
    );
  }

  async updateMass(id: string, data: Partial<InsertMass>): Promise<Mass | undefined> {
    const mass = this.masses.get(id);
    if (!mass) return undefined;
    
    const updated = { ...mass, ...data };
    this.masses.set(id, updated);
    return updated;
  }

  async deleteMass(id: string): Promise<boolean> {
    return this.masses.delete(id);
  }

  // Environment operations
  async createEnvironment(insertEnv: InsertEnvironment): Promise<Environment> {
    const id = randomUUID();
    const env: Environment = {
      id,
      ...insertEnv,
    };
    this.environments.set(id, env);
    return env;
  }

  async getEnvironment(id: string): Promise<Environment | undefined> {
    return this.environments.get(id);
  }

  async listEnvironments(): Promise<Environment[]> {
    return Array.from(this.environments.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }

  async deleteEnvironment(id: string): Promise<boolean> {
    return this.environments.delete(id);
  }

  // Ride operations
  async createRide(insertRide: InsertRide): Promise<Ride> {
    const id = randomUUID();
    const ride: Ride = {
      id,
      driverId: insertRide.driverId,
      massId: insertRide.massId,
      pickupPoint: insertRide.pickupPoint ?? null,
      seatsTotal: insertRide.seatsTotal ?? 1,
      seatsAvailable: insertRide.seatsTotal ?? 1,
      notes: insertRide.notes ?? null,
      status: insertRide.status ?? "active",
      createdAt: new Date(),
    };
    this.rides.set(id, ride);
    return ride;
  }

  async getRide(id: string): Promise<Ride | undefined> {
    return this.rides.get(id);
  }

  async listRides(massId?: string): Promise<Ride[]> {
    const rides = Array.from(this.rides.values());
    const filtered = massId 
      ? rides.filter(r => r.massId === massId && r.status === 'active')
      : rides.filter(r => r.status === 'active');
    
    return filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async updateRideSeats(id: string, seatsAvailable: number): Promise<Ride | undefined> {
    const ride = this.rides.get(id);
    if (!ride) return undefined;
    
    const updated = { ...ride, seatsAvailable };
    this.rides.set(id, updated);
    return updated;
  }

  async updateRideStatus(id: string, status: string): Promise<Ride | undefined> {
    const ride = this.rides.get(id);
    if (!ride) return undefined;
    
    const updated = { ...ride, status };
    this.rides.set(id, updated);
    return updated;
  }

  // Booking operations
  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const id = randomUUID();
    const booking: Booking = {
      id,
      rideId: insertBooking.rideId,
      passengerId: insertBooking.passengerId,
      seatsRequested: insertBooking.seatsRequested ?? 1,
      createdAt: new Date(),
    };
    this.bookings.set(id, booking);
    return booking;
  }

  async getBooking(id: string): Promise<Booking | undefined> {
    return this.bookings.get(id);
  }

  async listBookingsByPassenger(passengerId: string): Promise<Booking[]> {
    return Array.from(this.bookings.values())
      .filter(b => b.passengerId === passengerId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async listBookingsByRide(rideId: string): Promise<Booking[]> {
    return Array.from(this.bookings.values())
      .filter(b => b.rideId === rideId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async deleteBooking(id: string): Promise<boolean> {
    return this.bookings.delete(id);
  }
}

// PostgreSQL-backed storage implementation
export class PgStorage implements IStorage {
  // User operations
  async createUser(insertUser: InsertUser): Promise<User> {
    const passwordHash = await bcrypt.hash(insertUser.password, SALT_ROUNDS);
    
    const [user] = await db.insert(users).values({
      name: insertUser.name,
      email: insertUser.email,
      phone: insertUser.phone,
      lingkungan: insertUser.lingkungan ?? null,
      role: insertUser.role,
      passwordHash,
    }).returning();
    
    return user;
  }

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return user;
  }

  async authenticateUser(email: string, password: string): Promise<User | null> {
    const user = await this.getUserByEmail(email);
    if (!user) return null;
    
    const isValid = await bcrypt.compare(password, user.passwordHash);
    return isValid ? user : null;
  }

  // Mass operations
  async createMass(insertMass: InsertMass): Promise<Mass> {
    const [mass] = await db.insert(masses).values(insertMass).returning();
    return mass;
  }

  async getMass(id: string): Promise<Mass | undefined> {
    const [mass] = await db.select().from(masses).where(eq(masses.id, id)).limit(1);
    return mass;
  }

  async listMasses(): Promise<Mass[]> {
    return await db.select().from(masses).orderBy(masses.datetime);
  }

  async updateMass(id: string, data: Partial<InsertMass>): Promise<Mass | undefined> {
    const [updated] = await db.update(masses).set(data).where(eq(masses.id, id)).returning();
    return updated;
  }

  async deleteMass(id: string): Promise<boolean> {
    const result = await db.delete(masses).where(eq(masses.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // Environment operations
  async createEnvironment(insertEnv: InsertEnvironment): Promise<Environment> {
    const [env] = await db.insert(environments).values(insertEnv).returning();
    return env;
  }

  async getEnvironment(id: string): Promise<Environment | undefined> {
    const [env] = await db.select().from(environments).where(eq(environments.id, id)).limit(1);
    return env;
  }

  async listEnvironments(): Promise<Environment[]> {
    return await db.select().from(environments).orderBy(environments.name);
  }

  async deleteEnvironment(id: string): Promise<boolean> {
    const result = await db.delete(environments).where(eq(environments.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // Ride operations
  async createRide(insertRide: InsertRide): Promise<Ride> {
    const [ride] = await db.insert(rides).values({
      ...insertRide,
      seatsAvailable: insertRide.seatsTotal,
    }).returning();
    return ride;
  }

  async getRide(id: string): Promise<Ride | undefined> {
    const [ride] = await db.select().from(rides).where(eq(rides.id, id)).limit(1);
    return ride;
  }

  async listRides(massId?: string): Promise<Ride[]> {
    if (massId) {
      return await db.select()
        .from(rides)
        .where(and(eq(rides.massId, massId), eq(rides.status, "active")))
        .orderBy(desc(rides.createdAt));
    }
    
    return await db.select()
      .from(rides)
      .where(eq(rides.status, "active"))
      .orderBy(desc(rides.createdAt));
  }

  async updateRideSeats(id: string, seatsAvailable: number): Promise<Ride | undefined> {
    const [updated] = await db.update(rides)
      .set({ seatsAvailable })
      .where(eq(rides.id, id))
      .returning();
    return updated;
  }

  async updateRideStatus(id: string, status: string): Promise<Ride | undefined> {
    const [updated] = await db.update(rides)
      .set({ status })
      .where(eq(rides.id, id))
      .returning();
    return updated;
  }

  // Booking operations with transaction support
  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    return await db.transaction(async (tx) => {
      // Lock the ride row for update
      const [ride] = await tx.select()
        .from(rides)
        .where(and(eq(rides.id, insertBooking.rideId), eq(rides.status, "active")))
        .limit(1);

      if (!ride) {
        throw new Error("Ride not found or inactive");
      }

      if (ride.seatsAvailable < (insertBooking.seatsRequested ?? 1)) {
        throw new Error("Not enough seats available");
      }

      // Create booking
      const [booking] = await tx.insert(bookings)
        .values(insertBooking)
        .returning();

      // Update ride seats
      await tx.update(rides)
        .set({ seatsAvailable: ride.seatsAvailable - (insertBooking.seatsRequested ?? 1) })
        .where(eq(rides.id, insertBooking.rideId));

      return booking;
    });
  }

  async getBooking(id: string): Promise<Booking | undefined> {
    const [booking] = await db.select().from(bookings).where(eq(bookings.id, id)).limit(1);
    return booking;
  }

  async listBookingsByPassenger(passengerId: string): Promise<Booking[]> {
    return await db.select()
      .from(bookings)
      .where(eq(bookings.passengerId, passengerId))
      .orderBy(desc(bookings.createdAt));
  }

  async listBookingsByRide(rideId: string): Promise<Booking[]> {
    return await db.select()
      .from(bookings)
      .where(eq(bookings.rideId, rideId))
      .orderBy(desc(bookings.createdAt));
  }

  async deleteBooking(id: string): Promise<boolean> {
    return await db.transaction(async (tx) => {
      const [booking] = await tx.select()
        .from(bookings)
        .where(eq(bookings.id, id))
        .limit(1);

      if (!booking) {
        return false;
      }

      // Delete booking
      await tx.delete(bookings).where(eq(bookings.id, id));

      // Restore seats to ride
      const [ride] = await tx.select()
        .from(rides)
        .where(eq(rides.id, booking.rideId))
        .limit(1);

      if (ride) {
        await tx.update(rides)
          .set({ seatsAvailable: ride.seatsAvailable + booking.seatsRequested })
          .where(eq(rides.id, booking.rideId));
      }

      return true;
    });
  }
}

export const storage = new PgStorage();
export const memStorage = new MemStorage();
