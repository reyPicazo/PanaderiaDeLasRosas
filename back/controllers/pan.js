const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.post('/panes', async (req, res) => {
    const { nombre, precio } = req.body;
    
    if (!nombre || !precio) return res.status(400).json({ error: "Faltan campos obligatorios" });

    try {
        const [result] = await db.query('INSERT INTO Pan (nombre, precio) VALUES (?, ?)', [nombre, precio]);
        res.status(201).json({ message: 'Pan creado con éxito', idPan: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

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

router.delete('/panes/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.query('DELETE FROM Pan WHERE idPan = ?', [id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: "Pan no encontrado" });
        res.json({ message: 'Pan eliminado con éxito' });
    } catch (error) {
        res.status(400).json({ error: "No se puede eliminar el pan porque está asociado a una orden existente." });
    }
});

router.get('/panes', async (req, res) => {
    const { nombre, precioMin, precioMax } = req.query;
    
    let query = 'SELECT idPan, nombre, precio FROM Pan WHERE 1=1';
    const params = [];

    if (nombre) { 
        query += ' AND nombre LIKE ?'; 
        params.push(`%${nombre}%`); 
    }
    if (precioMin) { 
        query += ' AND precio >= ?'; 
        params.push(parseFloat(precioMin)); 
    }
    if (precioMax) { 
        query += ' AND precio <= ?'; 
        params.push(parseFloat(precioMax)); 
    }

    try {
        query += ' ORDER BY precio ASC';
        const [rows] = await db.query(query, params);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;