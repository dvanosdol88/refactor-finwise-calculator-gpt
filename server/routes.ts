import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import type { InsertSurveyResponse } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  // Survey response endpoints
  app.post("/api/survey-response", async (req, res) => {
    try {
      const body = req.body as InsertSurveyResponse;
      const response = await storage.saveSurveyResponse(body);
      res.json(response);
    } catch (error) {
      res.status(400).json({ error: "Failed to save survey response" });
    }
  });

  app.get("/api/survey-response", async (req, res) => {
    try {
      const response = await storage.getSurveyResponse();
      res.json(response || null);
    } catch (error) {
      res.status(400).json({ error: "Failed to retrieve survey response" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
