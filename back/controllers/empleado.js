const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Conexión al pool de MySQL

// 1. ALTA - Registrar un nuevo Empleado
router.post('/empleados', async (req, res) => {
    const { nombre, direccion, telefono } = req.body;

    // Validación básica de datos (Condición implícita de desarrollo)
    if (!nombre || !direccion || !telefono) {
        return res.status(400).json({ error: "Todos los campos (nombre, direccion, telefono) son obligatorios." });
    }

    try {
        const query = 'INSERT INTO Empleado (nombre, direccion, telefono) VALUES (?, ?, ?)';
        const [result] = await db.query(query, [nombre, direccion, telefono]);
        
        res.status(201).json({ 
            message: 'Empleado registrado con éxito', 
            idEmpleado: result.insertId 
        });
    } catch (error) {
        res.status(500).json({ error: "Error al registrar el empleado: " + error.message });
    }
});

// 2. CAMBIO - Editar datos de un Empleado
router.put('/empleados/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre, direccion, telefono } = req.body;

    // Al menos uno de los campos debe venir en la petición para poder actualizar
    if (!nombre && !direccion && !telefono) {
        return res.status(400).json({ error: "Debes proporcionar al menos un campo para actualizar." });
    }

    try {
        // En tu script SQL original haces un cambio específico al teléfono, 
        // pero esta consulta te permite actualizar cualquiera de los tres campos de forma segura.
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

// 3. BAJA - Eliminar un Empleado
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
        // Restricción de Integridad Referencial (Condición explícita de SQL):
        // Si el empleado ya atendió una orden, MySQL bloqueará la eliminación por la FK.
        res.status(400).json({ 
            error: "No se puede eliminar al empleado porque tiene órdenes o ventas asociadas en el historial." 
        });
    }
});

// 4. EXTRA - Obtener todos los empleados
router.get('/empleados', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT idEmpleado, nombre, telefono, direccion FROM Empleado');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;