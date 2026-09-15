import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { pool } from "./connection.js";

const scrypt = promisify(scryptCallback);

export async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = await scrypt(password, salt, 64);
  return `${salt}:${Buffer.from(hash).toString("hex")}`;
}

export async function verifyPassword(password, storedPassword) {
  const [salt, storedHash] = String(storedPassword).split(":");
  if (!salt || !storedHash) return false;
  const hash = Buffer.from(await scrypt(password, salt, 64));
  const expected = Buffer.from(storedHash, "hex");
  return hash.length === expected.length && timingSafeEqual(hash, expected);
}

function publicUser(row) {
  if (!row) return null;
  return { id: Number(row.id), name: row.name, email: row.email, profileImage: row.profileImage ?? null, diamonds: Number(row.diamonds ?? 0), createdAt: row.createdAt };
}

export async function createUser({ name, email, password, profileImage = null }) {
  const passwordHash = await hashPassword(password);
  const [result] = await pool.query("INSERT INTO tb_users (name, email, password, profile_image) VALUES (?, ?, ?, ?)", [name, email, passwordHash, profileImage]);
  return findUserById(result.insertId);
}

export async function findUserByEmail(email) {
  const [rows] = await pool.query("SELECT id_user AS id, name, email, password, profile_image AS profileImage, diamonds, created_at AS createdAt FROM tb_users WHERE email = ?", [email]);
  return rows[0] ?? null;
}

export async function findUserById(id) {
  const [rows] = await pool.query("SELECT id_user AS id, name, email, profile_image AS profileImage, diamonds, created_at AS createdAt FROM tb_users WHERE id_user = ?", [id]);
  return publicUser(rows[0]);
}

export { publicUser };