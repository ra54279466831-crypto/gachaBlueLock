import { Router } from "express";
import { databaseIsConfigured } from "./repo/connection.js";
import { listCharacters } from "./repo/caractersRepo.js";
import { createUser, findUserByEmail, findUserById, verifyPassword } from "./repo/usersRepo.js";
import { listUserCharacters, spinGacha } from "./repo/storageRepo.js";
import { getTeam, saveTeam } from "./repo/teamsRepo.js";
import { createToken, readToken } from "./utils/auth.js";

export default function addRoutes(app) {
  const api = Router();
  const auth = async (request, response, next) => { const data = readToken(request.headers.authorization?.replace("Bearer ", "")); const user = data && await findUserById(data.sub); if (!user) return response.status(401).json({ error: "Login required." }); request.user = user; next(); };
  api.get("/health", (_req, res) => res.json({ status: "ok", databaseConfigured: databaseIsConfigured() }));
  api.use((_req, res, next) => databaseIsConfigured() ? next() : res.status(503).json({ error: "Database is not configured." }));
  api.get("/characters", async (_req, res, next) => { try { res.json(await listCharacters()); } catch (error) { next(error); } });
  api.post("/auth/register", async (req, res, next) => { try { const { name, email, password, profileImage } = req.body; if (![name, email, password].every((value) => typeof value === "string" && value.trim()) || password.length < 6) return res.status(400).json({ error: "Name, email and a password with 6 characters are required." }); const user = await createUser({ name: name.trim(), email: email.trim().toLowerCase(), password, profileImage: typeof profileImage === "string" ? profileImage : null }); res.status(201).json({ user, token: createToken(user.id) }); } catch (error) { if (error.code === "ER_DUP_ENTRY") return res.status(409).json({ error: "Email already registered." }); next(error); } });
  api.post("/auth/login", async (req, res, next) => { try { const user = await findUserByEmail(String(req.body.email ?? "").trim().toLowerCase()); if (!user || !(await verifyPassword(req.body.password ?? "", user.password))) return res.status(401).json({ error: "Invalid email or password." }); const publicUser = await findUserById(user.id); res.json({ user: publicUser, token: createToken(user.id) }); } catch (error) { next(error); } });
  api.get("/auth/me", auth, (req, res) => res.json(req.user));
  api.get("/me/storage", auth, async (req, res, next) => { try { res.json(await listUserCharacters(req.user.id)); } catch (error) { next(error); } });
  api.post("/me/gacha", auth, async (req, res, next) => { try { const count = Number(req.body.count) === 10 ? 10 : 1; res.json(await spinGacha(req.user.id, count)); } catch (error) { res.status(error.status ?? 500); next(error); } });
  api.get("/me/team", auth, async (req, res, next) => { try { res.json(await getTeam(req.user.id)); } catch (error) { next(error); } });
  api.put("/me/team", auth, async (req, res, next) => { try { const lineup = Array.isArray(req.body.lineup) ? req.body.lineup : []; if (lineup.some((p) => !p.slot || !Number.isInteger(Number(p.characterId)))) return res.status(400).json({ error: "Invalid team." }); res.json(await saveTeam(req.user.id, { name: String(req.body.name ?? "Blue Lock XI").slice(0, 100), lineup })); } catch (error) { res.status(error.status ?? 500); next(error); } });
  app.use("/api", api);
}