import "dotenv/config";
import cors from "cors";
import express from "express";
import addRoutes from "./router.js";

const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(",") ?? true }));
app.use(express.json({ limit: "6mb" }));
addRoutes(app);
app.use((error, _request, response, _next) => { console.error(error); response.status(error.status ?? 500).json({ error: error.message ?? "Erro interno do servidor." }); });

const port = Number(process.env.PORT ?? 3001);
app.listen(port, () => console.log(`API rodando na porta ${port}`));