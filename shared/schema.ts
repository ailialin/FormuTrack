import { sql } from "drizzle-orm";
import { pgTable, text, varchar, decimal, integer, jsonb, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("production"), // admin, rd, production, finance
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const masterFormulationSheets = pgTable("master_formulation_sheets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  code: text("code").notNull().unique(),
  category: text("category").notNull(),
  version: text("version").notNull().default("v1.0"),
  status: text("status").notNull().default("draft"), // draft, active, inactive, archived
  formulation: jsonb("formulation").notNull(), // ingredients, instructions, qc_parameters
  createdBy: varchar("created_by").references(() => users.id),
  updatedAt: timestamp("updated_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const mfsVersions = pgTable("mfs_versions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  mfsId: varchar("mfs_id").references(() => masterFormulationSheets.id).notNull(),
  version: text("version").notNull(),
  formulation: jsonb("formulation").notNull(),
  changeLog: text("change_log"),
  createdBy: varchar("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const rawMaterials = pgTable("raw_materials", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  casNumber: text("cas_number"),
  supplier: text("supplier"),
  unitOfMeasure: text("unit_of_measure").notNull().default("g"),
  costPerUnit: decimal("cost_per_unit", { precision: 10, scale: 4 }).notNull(),
  category: text("category"),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const packagingOptions = pgTable("packaging_options", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  type: text("type").notNull(), // bottle, tube, jar, pump, etc.
  volume: integer("volume").notNull(), // in ml
  cost: decimal("cost", { precision: 10, scale: 4 }).notNull(),
  supplier: text("supplier"),
  material: text("material"),
  color: text("color"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const batchProductions = pgTable("batch_productions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  mfsId: varchar("mfs_id").references(() => masterFormulationSheets.id).notNull(),
  batchNumber: text("batch_number").notNull().unique(),
  targetUnits: integer("target_units").notNull(),
  unitSize: integer("unit_size").notNull(), // in ml
  lossFactor: decimal("loss_factor", { precision: 5, scale: 2 }).notNull().default("5.00"),
  scaledFormulation: jsonb("scaled_formulation").notNull(),
  totalVolume: decimal("total_volume", { precision: 10, scale: 2 }).notNull(),
  materialCost: decimal("material_cost", { precision: 10, scale: 2 }).notNull(),
  packagingCost: decimal("packaging_cost", { precision: 10, scale: 2 }).notNull(),
  laborCost: decimal("labor_cost", { precision: 10, scale: 2 }).notNull().default("0.00"),
  totalCost: decimal("total_cost", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("planned"), // planned, in_progress, completed, cancelled
  createdBy: varchar("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertMfsSchema = createInsertSchema(masterFormulationSheets).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMfsVersionSchema = createInsertSchema(mfsVersions).omit({
  id: true,
  createdAt: true,
});

export const insertRawMaterialSchema = createInsertSchema(rawMaterials).omit({
  id: true,
  createdAt: true,
});

export const insertPackagingSchema = createInsertSchema(packagingOptions).omit({
  id: true,
  createdAt: true,
});

export const insertBatchSchema = createInsertSchema(batchProductions).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type MasterFormulationSheet = typeof masterFormulationSheets.$inferSelect;
export type InsertMfs = z.infer<typeof insertMfsSchema>;

export type MfsVersion = typeof mfsVersions.$inferSelect;
export type InsertMfsVersion = z.infer<typeof insertMfsVersionSchema>;

export type RawMaterial = typeof rawMaterials.$inferSelect;
export type InsertRawMaterial = z.infer<typeof insertRawMaterialSchema>;

export type PackagingOption = typeof packagingOptions.$inferSelect;
export type InsertPackaging = z.infer<typeof insertPackagingSchema>;

export type BatchProduction = typeof batchProductions.$inferSelect;
export type InsertBatch = z.infer<typeof insertBatchSchema>;

// Formulation structure
export interface Ingredient {
  materialId: string;
  percentage: number;
  function: string;
}

export interface FormulationData {
  ingredients: Ingredient[];
  instructions: string;
  qcParameters: string;
  batchSettings?: {
    minBatchSize?: number;
    maxBatchSize?: number;
    standardLossFactor?: number;
  };
}
