const express = require('express');
const router = express.Router();
const db = require('../config/db');

// 1. ALTA DE ÓRDEN COMPLETA (Orden + Detalles)
router.post('/ordenes', async (req, res) => {
    const { fecha, ClienteId, EmpleadoId, detalles } = req.body; 
    // 'detalles' debe ser un arreglo: [{ PanidPan: 2, cantidad: 3 }, { PanidPan: 5, cantidad: 1 }]

    // Obtener una conexión exclusiva del pool para la transacción
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction(); // Inicio de la transacción

        // 1. Insertar en la tabla Orden
        const [ordenResult] = await connection.query(
            'INSERT INTO Orden (fecha, ClienteId, EmpleadoId, estado) VALUES (?, ?, ?, 0)',
            [fecha, ClienteId, EmpleadoId]
        );
        const nuevoIdOrden = ordenResult.insertId;

        // 2. Insertar los panes correspondientes en Detalle_Orden
        if (detalles && detalles.length > 0) {
            const queryDetalle = 'INSERT INTO Detalle_Orden (OrdenidOrden, PanidPan, cantidad) VALUES (?, ?, ?)';
            for (let item of detalles) {
                await connection.query(queryDetalle, [nuevoIdOrden, item.PanidPan, item.cantidad]);
            }
        }

        await connection.commit(); // Si todo salió bien, guardamos los cambios de forma permanente
        res.status(201).json({ message: 'Orden y detalles registrados con éxito', idOrden: nuevoIdOrden });

    } catch (error) {
        await connection.rollback(); // Si algo falló (ej. idPan inválido), se deshace todo para no dejar datos corruptos
        res.status(500).json({ error: "Error en la transacción: " + error.message });
    } finally {
        connection.release(); // Devolvemos la conexión al pool
    }
});

// 2. CAMBIOS EN LA ORDEN O DETALLES

// Editar datos generales de la Orden (como la fecha)





router.get('/ordenes', async (req, res) => {
    const { fecha, ClienteId, EmpleadoId, estado } = req.query;

    let query = `
        SELECT o.idOrden, o.fecha, o.estado,
               c.idCliente, c.nombre AS nombreCliente, c.direccion AS direccionCliente, c.telefono AS telefonoCliente,
               e.idEmpleado, e.nombre AS nombreEmpleado, e.direccion AS direccionEmpleado, e.telefono AS telefonoEmpleado
        FROM orden o
        JOIN cliente c ON o.ClienteId = c.idCliente
        JOIN empleado e ON o.EmpleadoId = e.idEmpleado
        WHERE 1=1
    `;
    const params = [];

    if (fecha) { query += ' AND o.fecha = ?'; params.push(fecha); }
    if (ClienteId) { query += ' AND o.ClienteId = ?'; params.push(ClienteId); }
    if (EmpleadoId) { query += ' AND o.EmpleadoId = ?'; params.push(EmpleadoId); }
    if (estado !== undefined) { query += ' AND o.estado = ?'; params.push(estado); }

    try {
        const [rows] = await db.query(query, params);

        const ordenes = rows.map(o => ({
            idOrden: o.idOrden,
            fecha: o.fecha,
            estado: o.estado,
            cliente: {
                idCliente: o.idCliente,
                nombre: o.nombreCliente,
                direccion: o.direccionCliente,
                telefono: o.telefonoCliente
            },
            empleado: {
                idEmpleado: o.idEmpleado,
                nombre: o.nombreEmpleado,
                direccion: o.direccionEmpleado,
                telefono: o.telefonoEmpleado
            }
        }));

        res.json(ordenes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



router.get('/ordenes/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.query(`
            SELECT o.idOrden, o.fecha, o.estado,
                   c.idCliente, c.nombre AS nombreCliente, c.direccion AS direccionCliente, c.telefono AS telefonoCliente,
                   e.idEmpleado, e.nombre AS nombreEmpleado, e.direccion AS direccionEmpleado, e.telefono AS telefonoEmpleado
            FROM orden o
            JOIN cliente c ON o.ClienteId = c.idCliente
            JOIN empleado e ON o.EmpleadoId = e.idEmpleado
            WHERE o.idOrden = ?
        `, [id]);

        if (rows.length === 0) return res.status(404).json({ error: 'Orden no encontrada' });

        const o = rows[0];

        const [detalles] = await db.query(`
            SELECT d.cantidad, p.idPan, p.nombre, p.precio
            FROM detalle_orden d
            JOIN pan p ON d.PanidPan = p.idPan
            WHERE d.OrdenidOrden = ?
        `, [id]);

        res.json({
            idOrden: o.idOrden,
            fecha: o.fecha,
            estado: o.estado,
            cliente: {
                idCliente: o.idCliente,
                nombre: o.nombreCliente,
                direccion: o.direccionCliente,
                telefono: o.telefonoCliente
            },
            empleado: {
                idEmpleado: o.idEmpleado,
                nombre: o.nombreEmpleado,
                direccion: o.direccionEmpleado,
                telefono: o.telefonoEmpleado
            },
            detalles: detalles.map(d => ({
                cantidad: d.cantidad,
                pan: {
                    idPan: d.idPan,
                    nombre: d.nombre,
                    precio: d.precio
                }
            }))
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



router.put('/ordenes/:id/detalles', async (req, res) => {
    const { id } = req.params;
    const { detalles, ClienteId } = req.body;
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        
        if (ClienteId) {
            await connection.query('UPDATE Orden SET ClienteId = ? WHERE idOrden = ?', [ClienteId, id]);
        }

        
        await connection.query('DELETE FROM Detalle_Orden WHERE OrdenidOrden = ?', [id]);

        
        for (let item of detalles) {
            await connection.query(
                'INSERT INTO Detalle_Orden (OrdenidOrden, PanidPan, cantidad) VALUES (?, ?, ?)',
                [id, item.PanidPan, item.cantidad]
            );
        }

        await connection.commit();
        res.json({ message: 'Orden actualizada correctamente' });

    } catch (error) {
        await connection.rollback();
        res.status(500).json({ error: error.message });
    } finally {
        connection.release();
    }
});








router.put('/ordenes/:id/estado', async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;
    try {
        await db.query('UPDATE Orden SET estado = ? WHERE idOrden = ?', [estado, id]);
        res.json({ message: 'Estado de orden actualizado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.put('/ordenes/:id', async (req, res) => {
    const { id } = req.params;
    const { fecha } = req.body;
    try {
        await db.query('UPDATE Orden SET fecha = ? WHERE idOrden = ?', [fecha, id]);
        res.json({ message: 'Fecha de orden actualizada' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.put('/ordenes/:idOrden/detalles/:idPan', async (req, res) => {
    const { idOrden, idPan } = req.params;
    const { cantidad } = req.body;
    try {
        await db.query(
            'UPDATE Detalle_Orden SET cantidad = ? WHERE OrdenidOrden = ? AND PanidPan = ?',
            [cantidad, idOrden, idPan]
        );
        res.json({ message: 'Cantidad de producto modificada en la orden' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 3. BAJAS (Eliminar)

// Eliminar un producto específico de una orden
router.delete('/ordenes/:idOrden/detalles/:idPan', async (sqlReq, res) => {
    const { idOrden, idPan } = sqlReq.params;
    try {
        await db.query('DELETE FROM Detalle_Orden WHERE OrdenidOrden = ? AND PanidPan = ?', [idOrden, idPan]);
        res.json({ message: 'Producto removido de la orden' });
    } catch (error) { res.status(500).json({ error: error.message }); }
});

// Eliminar la orden completa
router.delete('/ordenes/:id', async (req, res) => {
    const { id } = req.params;
    try {
        // Condición implícita resuelta por tu SQL: Al borrar la orden, 
        // ON DELETE CASCADE eliminará automáticamente los renglones en Detalle_Orden.
        await db.query('DELETE FROM Orden WHERE idOrden = ?', [id]);
        res.json({ message: 'Orden y sus detalles eliminados correctamente' });
    } catch (error) { res.status(500).json({ error: error.message }); }
});

module.exports = router;