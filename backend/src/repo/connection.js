import mysql from "mysql2/promise.js";
import "dotenv/config";

const requiredVariables = ["DB_HOST", "DB_USER", "DB_DATABASE"];

export function databaseIsConfigured() {
  return requiredVariables.every((variable) => Boolean(process.env[variable]));
}

export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT ?? 3306),
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
});