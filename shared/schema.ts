import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone").notNull(),
  lingkungan: text("lingkungan"),
  role: text("role").notNull().default("passenger"),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const masses = pgTable("masses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  datetime: timestamp("datetime").notNull(),
  special: boolean("special").notNull().default(false),
});

export const environments = pgTable("environments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
});

export const rides = pgTable("rides", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  driverId: varchar("driver_id").notNull().references(() => users.id),
  massId: varchar("mass_id").notNull().references(() => masses.id),
  pickupPoint: text("pickup_point"),
  seatsTotal: integer("seats_total").notNull().default(1),
  seatsAvailable: integer("seats_available").notNull().default(1),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  status: text("status").notNull().default("active"),
});

export const bookings = pgTable("bookings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  rideId: varchar("ride_id").notNull().references(() => rides.id),
  passengerId: varchar("passenger_id").notNull().references(() => users.id),
  seatsRequested: integer("seats_requested").notNull().default(1),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  passwordHash: true,
}).extend({
  password: z.string().min(6, "Password harus minimal 6 karakter"),
});

export const insertMassSchema = createInsertSchema(masses).omit({
  id: true,
});

export const insertEnvironmentSchema = createInsertSchema(environments).omit({
  id: true,
});

export const insertRideSchema = createInsertSchema(rides).omit({
  id: true,
  createdAt: true,
  seatsAvailable: true,
});

export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Mass = typeof masses.$inferSelect;
export type InsertMass = z.infer<typeof insertMassSchema>;
export type Environment = typeof environments.$inferSelect;
export type InsertEnvironment = z.infer<typeof insertEnvironmentSchema>;
export type Ride = typeof rides.$inferSelect;
export type InsertRide = z.infer<typeof insertRideSchema>;
export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = z.infer<typeof insertBookingSchema>;
