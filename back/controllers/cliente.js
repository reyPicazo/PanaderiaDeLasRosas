const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.post('/clientes', async (req, res) => {
    const { nombre, direccion, telefono } = req.body;
    try {
        const [result] = await db.query('INSERT INTO Cliente (nombre, direccion, telefono) VALUES (?, ?, ?)', [nombre, direccion, telefono]);
        res.status(201).json({ idCliente: result.insertId, message: 'Cliente registrado' });
    } catch (error) { 
        res.status(500).json({ error: error.message }); 
    }
});

router.put('/clientes/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre, direccion, telefono } = req.body;
    try {
        await db.query('UPDATE Cliente SET nombre = ?, direccion = ?, telefono = ? WHERE idCliente = ?', [nombre, direccion, telefono, id]);
        res.json({ message: 'Cliente actualizado' });
    } catch (error) { 
        res.status(500).json({ error: error.message }); 
    }
});

router.delete('/clientes/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM Cliente WHERE idCliente = ?', [id]);
        res.json({ message: 'Cliente eliminado' });
    } catch (error) { 
        res.status(400).json({ error: "Error al eliminar. Verifique que el cliente no tenga órdenes activas." }); 
    }
});

router.get('/clientes', async (req, res) => {
    const { nombre, direccion, telefono } = req.query;
    
    let query = 'SELECT idCliente, nombre, direccion, telefono FROM Cliente WHERE 1=1';
    const params = [];

    if (nombre) { 
        query += ' AND nombre LIKE ?'; 
        params.push(`%${nombre}%`); 
    }
    if (direccion) { 
        query += ' AND direccion LIKE ?'; 
        params.push(`%${direccion}%`); 
    }
    if (telefono) { 
        query += ' AND telefono = ?'; 
        params.push(telefono); 
    }

    try {
        const [rows] = await db.query(query, params);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;