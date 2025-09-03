import express from "express";
import cors from "cors";
import "./db.js"; // asegura la inicialización de la DB
import voluntarioRoutes from "./routes/voluntarios.js";
import donacionRoutes from "./routes/donaciones.js";
import transporteRoutes from "./routes/transportes.js";

const app = express();
app.use(cors({ origin: ["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"], credentials: true }));
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ ok: true, service: "nexa-backend" }));

app.use("/api/voluntarios", voluntarioRoutes);
app.use("/api/donaciones", donacionRoutes);
app.use("/api/transportes", transporteRoutes);

// 404
app.use((req, res) => {
res.status(404).json({ error: "Ruta no encontrada" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor backend http://localhost:${PORT}`));
