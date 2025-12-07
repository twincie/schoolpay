import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

// Entities
import { Category } from '../entities/Category';
import { Student } from '../entities/Student';
import { Payment } from '../entities/Payment';
import { Class } from '../entities/Class';

dotenv.config();

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "password",
  database: process.env.DB_NAME || "school_expense_db",
  entities: [Category, Student, Payment, Class],
  synchronize: true, // Set to false in production
  logging: true, // Set to false in production
  migrations: [path.join(__dirname, "../migrations/*{.ts,.js}")],
  subscribers: [],
});

// Initialize TypeORM connection
export const initializeTypeORM = async (): Promise<void> => {
  try {
    await AppDataSource.initialize();
    console.log("🔌 TypeORM connected to PostgreSQL database");
    
    if (AppDataSource.options.synchronize) {
      console.log("📊 Database synchronization enabled");
    }
  } catch (error) {
    console.error("❌ TypeORM connection error:", error);
    throw error;
  }
};

export const getDataSource = (): DataSource => {
  return AppDataSource;
};