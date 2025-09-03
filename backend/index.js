import express from "express";
import cors from "cors";
import "./db.js"; // asegura la inicialización de la DB
import voluntarioRoutes from "./routes/voluntarios.js";
import donacionRoutes from "./routes/donaciones.js";
import transporteRoutes from "./routes/transportes.js";

const app = express();

// Configure CORS for production
const allowedOrigins = [
  "http://localhost:5173", 
  "http://127.0.0.1:5173", 
  "http://localhost:3000",
  process.env.FRONTEND_URL,
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null
].filter(Boolean);

app.use(cors({ 
  origin: allowedOrigins, 
  credentials: true 
}));
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ ok: true, service: "nexa-backend" }));

app.use("/api/voluntarios", voluntarioRoutes);
app.use("/api/donaciones", donacionRoutes);
app.use("/api/transportes", transporteRoutes);

// 404
app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

// Export for Vercel
export default app;

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Servidor backend http://localhost:${PORT}`));
}
