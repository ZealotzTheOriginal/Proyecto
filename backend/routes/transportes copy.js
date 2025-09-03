import express from "express";
import { db } from "../db.js";

const router = express.Router();

// LISTAR
router.get("/", async (req, res) => {
  try {
    const rows = await db.all("SELECT * FROM transportes ORDER BY id DESC");
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// CREAR
router.post("/", async (req, res) => {
  try {
    const { vehiculo, conductor, disponibilidad } = req.body;
    if (!vehiculo) return res.status(400).json({ error: "'vehiculo' es obligatorio" });

    const valid = ["Disponible", "Ocupado", "Mantenimiento"];
    const disp = valid.includes(disponibilidad) ? disponibilidad : "Disponible";

    const result = await db.run(
      "INSERT INTO transportes (vehiculo, conductor, disponibilidad) VALUES (?, ?, ?)",
      [vehiculo, conductor ?? null, disp]
    );

    const created = await db.get("SELECT * FROM transportes WHERE id = ?", result.lastID);
    res.json(created);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ACTUALIZAR
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { vehiculo, conductor, disponibilidad } = req.body;
    if (!vehiculo) return res.status(400).json({ error: "'vehiculo' es obligatorio" });

    const valid = ["Disponible", "Ocupado", "Mantenimiento"];
    const disp = valid.includes(disponibilidad) ? disponibilidad : "Disponible";

    await db.run(
      "UPDATE transportes SET vehiculo = ?, conductor = ?, disponibilidad = ? WHERE id = ?",
      [vehiculo, conductor ?? null, disp, id]
    );

    const updated = await db.get("SELECT * FROM transportes WHERE id = ?", id);
    res.json(updated);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ELIMINAR
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.run("DELETE FROM transportes WHERE id = ?", id);
    res.json({ message: "Transporte eliminado" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
