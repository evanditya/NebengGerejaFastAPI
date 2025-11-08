import { randomUUID } from "crypto";

export interface IStorage {
  // Storage interface will be implemented later
}

export class MemStorage implements IStorage {
  constructor() {
    // Storage implementation will be added later
  }
}

export const storage = new MemStorage();
