import express from "express";
import { db } from "../db.js";

const router = express.Router();

// LISTAR
router.get("/", async (req, res) => {
  try {
    const rows = await db.all("SELECT * FROM voluntarios ORDER BY id DESC");
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// CREAR
router.post("/", async (req, res) => {
  try {
    const { nombre, email, telefono } = req.body;
    if (!nombre) return res.status(400).json({ error: "'nombre' es obligatorio" });

    const result = await db.run(
      "INSERT INTO voluntarios (nombre, email, telefono) VALUES (?, ?, ?)",
      [nombre, email ?? null, telefono ?? null]
    );

    const created = await db.get("SELECT * FROM voluntarios WHERE id = ?", result.lastID);
    res.json(created);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ACTUALIZAR
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, email, telefono } = req.body;
    if (!nombre) return res.status(400).json({ error: "'nombre' es obligatorio" });

    await db.run(
      "UPDATE voluntarios SET nombre = ?, email = ?, telefono = ? WHERE id = ?",
      [nombre, email ?? null, telefono ?? null, id]
    );

    const updated = await db.get("SELECT * FROM voluntarios WHERE id = ?", id);
    res.json(updated);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ELIMINAR
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.run("DELETE FROM voluntarios WHERE id = ?", id);
    res.json({ message: "Voluntario eliminado" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
