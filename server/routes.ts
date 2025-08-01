import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertMfsSchema, insertRawMaterialSchema, insertPackagingSchema, insertBatchSchema, insertUserSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.json({ user: { ...user, password: undefined } });
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Invalid data" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await storage.getUserByEmail(email);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      res.json({ user: { ...user, password: undefined } });
    } catch (error) {
      res.status(500).json({ message: "Login failed" });
    }
  });

  // MFS routes
  app.get("/api/mfs", async (req, res) => {
    try {
      const mfsList = await storage.getAllMfs();
      res.json(mfsList);
    } catch (error) {
      console.error("Error fetching MFS:", error);
      res.status(500).json({ message: "Failed to fetch MFS", error: error instanceof Error ? error.message : String(error) });
    }
  });

  app.get("/api/mfs/:id", async (req, res) => {
    try {
      const mfs = await storage.getMfsById(req.params.id);
      if (!mfs) {
        return res.status(404).json({ message: "MFS not found" });
      }
      res.json(mfs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch MFS" });
    }
  });

  app.post("/api/mfs", async (req, res) => {
    try {
      const mfsData = insertMfsSchema.parse(req.body);
      const mfs = await storage.createMfs(mfsData);
      res.json(mfs);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Invalid data" });
    }
  });

  app.put("/api/mfs/:id", async (req, res) => {
    try {
      const mfsData = insertMfsSchema.partial().parse(req.body);
      const mfs = await storage.updateMfs(req.params.id, mfsData);
      res.json(mfs);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Update failed" });
    }
  });

  app.delete("/api/mfs/:id", async (req, res) => {
    try {
      await storage.deleteMfs(req.params.id);
      res.json({ message: "MFS deleted" });
    } catch (error) {
      res.status(500).json({ message: "Delete failed" });
    }
  });

  app.post("/api/mfs/:id/duplicate", async (req, res) => {
    try {
      const { name, code } = req.body;
      const mfs = await storage.duplicateMfs(req.params.id, name, code);
      res.json(mfs);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Duplication failed" });
    }
  });

  // MFS Versions routes
  app.get("/api/mfs/:id/versions", async (req, res) => {
    try {
      const versions = await storage.getMfsVersions(req.params.id);
      res.json(versions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch versions" });
    }
  });

  // Raw Materials routes
  app.get("/api/materials", async (req, res) => {
    try {
      const materials = await storage.getAllRawMaterials();
      res.json(materials);
    } catch (error) {
      console.error("Error fetching materials:", error);
      res.status(500).json({ message: "Failed to fetch materials", error: error instanceof Error ? error.message : String(error) });
    }
  });

  app.post("/api/materials", async (req, res) => {
    try {
      const materialData = insertRawMaterialSchema.parse(req.body);
      const material = await storage.createRawMaterial(materialData);
      res.json(material);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Invalid data" });
    }
  });

  app.put("/api/materials/:id", async (req, res) => {
    try {
      const materialData = insertRawMaterialSchema.partial().parse(req.body);
      const material = await storage.updateRawMaterial(req.params.id, materialData);
      res.json(material);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Update failed" });
    }
  });

  app.delete("/api/materials/:id", async (req, res) => {
    try {
      await storage.deleteRawMaterial(req.params.id);
      res.json({ message: "Material deleted" });
    } catch (error) {
      res.status(500).json({ message: "Delete failed" });
    }
  });

  // Packaging routes
  app.get("/api/packaging", async (req, res) => {
    try {
      const packaging = await storage.getAllPackaging();
      res.json(packaging);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch packaging" });
    }
  });

  app.post("/api/packaging", async (req, res) => {
    try {
      const packagingData = insertPackagingSchema.parse(req.body);
      const packaging = await storage.createPackaging(packagingData);
      res.json(packaging);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Invalid data" });
    }
  });

  // Batch Production routes
  app.get("/api/batches", async (req, res) => {
    try {
      const batches = await storage.getAllBatches();
      res.json(batches);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch batches" });
    }
  });

  app.post("/api/batches", async (req, res) => {
    try {
      const batchData = insertBatchSchema.parse(req.body);
      const batch = await storage.createBatch(batchData);
      res.json(batch);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Invalid data" });
    }
  });

  // Batch calculation endpoint
  app.post("/api/batches/calculate", async (req, res) => {
    try {
      const { mfsId, targetUnits, unitSize, lossFactor = 5 } = req.body;
      
      const mfs = await storage.getMfsById(mfsId);
      if (!mfs) {
        return res.status(404).json({ message: "MFS not found" });
      }

      const materials = await storage.getAllRawMaterials();
      const packaging = await storage.getAllPackaging();

      // Calculate scaled formulation
      const totalVolume = (targetUnits * unitSize * (1 + lossFactor / 100)) / 1000; // Convert to liters
      const formulation = mfs.formulation as any;
      
      let materialCost = 0;
      const scaledIngredients = formulation.ingredients.map((ingredient: any) => {
        const material = materials.find(m => m.id === ingredient.materialId);
        if (material) {
          const quantityKg = (totalVolume * ingredient.percentage / 100);
          const cost = quantityKg * parseFloat(material.costPerUnit);
          materialCost += cost;
          
          return {
            ...ingredient,
            quantity: quantityKg,
            cost: cost
          };
        }
        return ingredient;
      });

      // Simple packaging cost calculation (assume first suitable package)
      const suitablePackaging = packaging.find(p => p.volume >= unitSize);
      const packagingCost = suitablePackaging ? targetUnits * parseFloat(suitablePackaging.cost) : 0;
      
      const totalCost = materialCost + packagingCost;

      res.json({
        totalVolume,
        materialCost,
        packagingCost,
        totalCost,
        scaledIngredients,
        costPerUnit: totalCost / targetUnits
      });
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Calculation failed" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
