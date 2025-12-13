import { type User, type InsertUser, type SurveyResponse, type InsertSurveyResponse } from "@shared/schema";
import { randomUUID } from "crypto";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  saveSurveyResponse(response: InsertSurveyResponse): Promise<SurveyResponse>;
  getSurveyResponse(): Promise<SurveyResponse | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private surveyResponse: SurveyResponse | undefined;

  constructor() {
    this.users = new Map();
    this.surveyResponse = undefined;
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async saveSurveyResponse(response: InsertSurveyResponse): Promise<SurveyResponse> {
    const id = randomUUID();
    const surveyResponse: SurveyResponse = {
      ...response,
      id,
      timestamp: Date.now(),
    };
    this.surveyResponse = surveyResponse;
    return surveyResponse;
  }

  async getSurveyResponse(): Promise<SurveyResponse | undefined> {
    return this.surveyResponse;
  }
}

export const storage = new MemStorage();
