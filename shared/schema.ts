import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, real, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const sensorData = pgTable("sensor_data", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  temperature: real("temperature").notNull(),
  humidity: real("humidity").notNull(),
  soil_moisture: real("soil_temp").notNull(),
  fertilizerLevel: real("fertilizer_level").notNull(),
});

export const wateringSchedule = pgTable("watering_schedule", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  date: timestamp("date").notNull(),
  frequency: text("frequency").notNull(),
  status: text("status").notNull(),
});

export const fertilizerSchedule = pgTable("fertilizer_schedule", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  date: timestamp("date").notNull(),
  amount: real("amount").notNull(),
  status: text("status").notNull(),
});

export const harvestSchedule = pgTable("harvest_schedule", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  date: timestamp("date").notNull(),
  estimatedYield: real("estimated_yield"),
  status: text("status").notNull(),
});

export const alerts = pgTable("alerts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  type: text("type").notNull(),
  severity: text("severity").notNull(),
  message: text("message").notNull(),
  resolved: boolean("resolved").notNull().default(false),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertSensorDataSchema = createInsertSchema(sensorData).omit({ id: true });
export const insertWateringScheduleSchema = createInsertSchema(wateringSchedule).omit({ id: true });
export const insertFertilizerScheduleSchema = createInsertSchema(fertilizerSchedule).omit({ id: true });
export const insertHarvestScheduleSchema = createInsertSchema(harvestSchedule).omit({ id: true });
export const insertAlertSchema = createInsertSchema(alerts).omit({ id: true });

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type SensorData = typeof sensorData.$inferSelect;
export type InsertSensorData = z.infer<typeof insertSensorDataSchema>;
export type WateringSchedule = typeof wateringSchedule.$inferSelect;
export type InsertWateringSchedule = z.infer<typeof insertWateringScheduleSchema>;
export type FertilizerSchedule = typeof fertilizerSchedule.$inferSelect;
export type InsertFertilizerSchedule = z.infer<typeof insertFertilizerScheduleSchema>;
export type HarvestSchedule = typeof harvestSchedule.$inferSelect;
export type InsertHarvestSchedule = z.infer<typeof insertHarvestScheduleSchema>;
export type Alert = typeof alerts.$inferSelect;
export type InsertAlert = z.infer<typeof insertAlertSchema>;
