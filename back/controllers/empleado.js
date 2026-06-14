const express = require('express');
const router = express.Router();
const db = require('../config/db'); 

router.post('/empleados', async (req, res) => {
    const { nombre, direccion, telefono } = req.body;
    try {
        const [result] = await db.query('INSERT INTO Empleado (nombre, direccion, telefono) VALUES (?, ?, ?)', [nombre, direccion, telefono]);
        res.status(201).json({ idEmpleado: result.insertId, message: 'Empleado registrado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/empleados', async (req, res) => {
    const { nombre, direccion, telefono } = req.query;
    
    let query = 'SELECT idEmpleado, nombre, direccion, telefono FROM Empleado WHERE 1=1';
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

router.put('/empleados/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre, direccion, telefono } = req.body;

    if (!nombre && !direccion && !telefono) {
        return res.status(400).json({ error: "Debes proporcionar al menos un campo para actualizar." });
    }

    try {
        const query = 'UPDATE Empleado SET nombre = ?, direccion = ?, telefono = ? WHERE idEmpleado = ?';
        const [result] = await db.query(query, [nombre, direccion, telefono, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Empleado no encontrado en el sistema." });
        }

        res.json({ message: 'Datos del empleado actualizados correctamente' });
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar el empleado: " + error.message });
    }
});

router.delete('/empleados/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const query = 'DELETE FROM Empleado WHERE idEmpleado = ?';
        const [result] = await db.query(query, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Empleado no encontrado." });
        }

        res.json({ message: 'Empleado eliminado del sistema con éxito' });
    } catch (error) {
        res.status(400).json({ error: "No se puede eliminar al empleado porque tiene órdenes o ventas asociadas en el historial." });
    }
});

module.exports = router;