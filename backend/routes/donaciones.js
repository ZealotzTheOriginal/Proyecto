import express from "express";
import { db } from "../db.js";

const router = express.Router();

// LISTAR
router.get("/", async (req, res) => {
  try {
    const rows = await db.all("SELECT * FROM donaciones ORDER BY id DESC");
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// CREAR
router.post("/", async (req, res) => {
  try {
    const { tipo, valor, descripcion } = req.body;
    if (!tipo || !["economica", "en_especie"].includes(tipo)) {
      return res.status(400).json({ error: "'tipo' debe ser 'economica' o 'en_especie'" });
    }

    const _valor = Number.isFinite(Number(valor)) ? Number(valor) : 0;
    const result = await db.run(
      "INSERT INTO donaciones (tipo, valor, descripcion) VALUES (?, ?, ?)",
      [tipo, _valor, descripcion ?? null]
    );

    const created = await db.get("SELECT * FROM donaciones WHERE id = ?", result.lastID);
    res.json(created);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ACTUALIZAR
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { tipo, valor, descripcion } = req.body;
    if (!tipo || !["economica", "en_especie"].includes(tipo)) {
      return res.status(400).json({ error: "'tipo' debe ser 'economica' o 'en_especie'" });
    }

    const _valor = Number.isFinite(Number(valor)) ? Number(valor) : 0;
    await db.run(
      "UPDATE donaciones SET tipo = ?, valor = ?, descripcion = ? WHERE id = ?",
      [tipo, _valor, descripcion ?? null, id]
    );

    const updated = await db.get("SELECT * FROM donaciones WHERE id = ?", id);
    res.json(updated);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ELIMINAR
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.run("DELETE FROM donaciones WHERE id = ?", id);
    res.json({ message: "Donación eliminada" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
