import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { eq, desc, and } from "drizzle-orm";
import {
  type User,
  type InsertUser,
  type MasterFormulationSheet,
  type InsertMfs,
  type MfsVersion,
  type InsertMfsVersion,
  type RawMaterial,
  type InsertRawMaterial,
  type PackagingOption,
  type InsertPackaging,
  type BatchProduction,
  type InsertBatch,
  users,
  masterFormulationSheets,
  mfsVersions,
  rawMaterials,
  packagingOptions,
  batchProductions,
} from "@shared/schema";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // MFS
  getAllMfs(): Promise<MasterFormulationSheet[]>;
  getMfsById(id: string): Promise<MasterFormulationSheet | undefined>;
  createMfs(mfs: InsertMfs): Promise<MasterFormulationSheet>;
  updateMfs(id: string, mfs: Partial<InsertMfs>): Promise<MasterFormulationSheet>;
  deleteMfs(id: string): Promise<void>;
  duplicateMfs(id: string, newName: string, newCode: string): Promise<MasterFormulationSheet>;
  
  // MFS Versions
  getMfsVersions(mfsId: string): Promise<MfsVersion[]>;
  createMfsVersion(version: InsertMfsVersion): Promise<MfsVersion>;
  
  // Raw Materials
  getAllRawMaterials(): Promise<RawMaterial[]>;
  getRawMaterialById(id: string): Promise<RawMaterial | undefined>;
  createRawMaterial(material: InsertRawMaterial): Promise<RawMaterial>;
  updateRawMaterial(id: string, material: Partial<InsertRawMaterial>): Promise<RawMaterial>;
  deleteRawMaterial(id: string): Promise<void>;
  
  // Packaging
  getAllPackaging(): Promise<PackagingOption[]>;
  getPackagingById(id: string): Promise<PackagingOption | undefined>;
  createPackaging(packaging: InsertPackaging): Promise<PackagingOption>;
  updatePackaging(id: string, packaging: Partial<InsertPackaging>): Promise<PackagingOption>;
  deletePackaging(id: string): Promise<void>;
  
  // Batch Production
  getAllBatches(): Promise<BatchProduction[]>;
  getBatchById(id: string): Promise<BatchProduction | undefined>;
  createBatch(batch: InsertBatch): Promise<BatchProduction>;
  updateBatch(id: string, batch: Partial<InsertBatch>): Promise<BatchProduction>;
  deleteBatch(id: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }

  // MFS
  async getAllMfs(): Promise<MasterFormulationSheet[]> {
    return await db.select().from(masterFormulationSheets).orderBy(desc(masterFormulationSheets.updatedAt));
  }

  async getMfsById(id: string): Promise<MasterFormulationSheet | undefined> {
    const result = await db.select().from(masterFormulationSheets).where(eq(masterFormulationSheets.id, id)).limit(1);
    return result[0];
  }

  async createMfs(mfs: InsertMfs): Promise<MasterFormulationSheet> {
    const result = await db.insert(masterFormulationSheets).values(mfs).returning();
    return result[0];
  }

  async updateMfs(id: string, mfs: Partial<InsertMfs>): Promise<MasterFormulationSheet> {
    const result = await db.update(masterFormulationSheets)
      .set({ ...mfs, updatedAt: new Date() })
      .where(eq(masterFormulationSheets.id, id))
      .returning();
    return result[0];
  }

  async deleteMfs(id: string): Promise<void> {
    await db.delete(masterFormulationSheets).where(eq(masterFormulationSheets.id, id));
  }

  async duplicateMfs(id: string, newName: string, newCode: string): Promise<MasterFormulationSheet> {
    const original = await this.getMfsById(id);
    if (!original) throw new Error("MFS not found");
    
    const duplicate: InsertMfs = {
      name: newName,
      code: newCode,
      category: original.category,
      version: "v1.0",
      status: "draft",
      formulation: original.formulation as any,
      createdBy: original.createdBy,
    };
    
    return await this.createMfs(duplicate);
  }

  // MFS Versions
  async getMfsVersions(mfsId: string): Promise<MfsVersion[]> {
    return await db.select().from(mfsVersions)
      .where(eq(mfsVersions.mfsId, mfsId))
      .orderBy(desc(mfsVersions.createdAt));
  }

  async createMfsVersion(version: InsertMfsVersion): Promise<MfsVersion> {
    const result = await db.insert(mfsVersions).values(version).returning();
    return result[0];
  }

  // Raw Materials
  async getAllRawMaterials(): Promise<RawMaterial[]> {
    return await db.select().from(rawMaterials).orderBy(rawMaterials.name);
  }

  async getRawMaterialById(id: string): Promise<RawMaterial | undefined> {
    const result = await db.select().from(rawMaterials).where(eq(rawMaterials.id, id)).limit(1);
    return result[0];
  }

  async createRawMaterial(material: InsertRawMaterial): Promise<RawMaterial> {
    const result = await db.insert(rawMaterials).values(material).returning();
    return result[0];
  }

  async updateRawMaterial(id: string, material: Partial<InsertRawMaterial>): Promise<RawMaterial> {
    const result = await db.update(rawMaterials)
      .set(material)
      .where(eq(rawMaterials.id, id))
      .returning();
    return result[0];
  }

  async deleteRawMaterial(id: string): Promise<void> {
    await db.delete(rawMaterials).where(eq(rawMaterials.id, id));
  }

  // Packaging
  async getAllPackaging(): Promise<PackagingOption[]> {
    return await db.select().from(packagingOptions).orderBy(packagingOptions.name);
  }

  async getPackagingById(id: string): Promise<PackagingOption | undefined> {
    const result = await db.select().from(packagingOptions).where(eq(packagingOptions.id, id)).limit(1);
    return result[0];
  }

  async createPackaging(packaging: InsertPackaging): Promise<PackagingOption> {
    const result = await db.insert(packagingOptions).values(packaging).returning();
    return result[0];
  }

  async updatePackaging(id: string, packaging: Partial<InsertPackaging>): Promise<PackagingOption> {
    const result = await db.update(packagingOptions)
      .set(packaging)
      .where(eq(packagingOptions.id, id))
      .returning();
    return result[0];
  }

  async deletePackaging(id: string): Promise<void> {
    await db.delete(packagingOptions).where(eq(packagingOptions.id, id));
  }

  // Batch Production
  async getAllBatches(): Promise<BatchProduction[]> {
    return await db.select().from(batchProductions).orderBy(desc(batchProductions.createdAt));
  }

  async getBatchById(id: string): Promise<BatchProduction | undefined> {
    const result = await db.select().from(batchProductions).where(eq(batchProductions.id, id)).limit(1);
    return result[0];
  }

  async createBatch(batch: InsertBatch): Promise<BatchProduction> {
    const result = await db.insert(batchProductions).values(batch).returning();
    return result[0];
  }

  async updateBatch(id: string, batch: Partial<InsertBatch>): Promise<BatchProduction> {
    const result = await db.update(batchProductions)
      .set(batch)
      .where(eq(batchProductions.id, id))
      .returning();
    return result[0];
  }

  async deleteBatch(id: string): Promise<void> {
    await db.delete(batchProductions).where(eq(batchProductions.id, id));
  }
}

export const storage = new DatabaseStorage();
