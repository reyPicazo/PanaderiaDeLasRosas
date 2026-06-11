const express = require('express');
const router = express.Router();
const db = require('../config/db');

// ALTA
router.post('/panes', async (req, res) => {
    const { nombre, precio } = req.body;
    // Condición implícita: Validar datos de entrada
    if (!nombre || !precio) return res.status(400).json({ error: "Faltan campos obligatorios" });

    try {
        const [result] = await db.query('INSERT INTO Pan (nombre, precio) VALUES (?, ?)', [nombre, precio]);
        res.status(201).json({ message: 'Pan creado con éxito', idPan: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// CAMBIO
router.put('/panes/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre, precio } = req.body;

    try {
        const [result] = await db.query('UPDATE Pan SET nombre = ?, precio = ? WHERE idPan = ?', [nombre, precio, id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: "Pan no encontrado" });
        res.json({ message: 'Pan actualizado con éxito' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// BAJA 
router.delete('/panes/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.query('DELETE FROM Pan WHERE idPan = ?', [id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: "Pan no encontrado" });
        res.json({ message: 'Pan eliminado con éxito' });
    } catch (error) {
        // Condición implícita de SQL: Si el pan ya está en una orden, dará error de llave foránea.
        res.status(400).json({ error: "No se puede eliminar el pan porque está asociado a una orden existente." });
    }
});

router.get('/panes', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT idPan, nombre, precio FROM Pan');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;