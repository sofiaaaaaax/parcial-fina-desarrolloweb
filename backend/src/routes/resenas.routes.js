const express = require('express');
const pool = require('../config/db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

// Obtener SOLO las reseñas del usuario autenticado
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id,
              nombre_restaurante,
              calificacion,
              DATE_FORMAT(fecha_visita, '%Y-%m-%d') AS fecha_visita,
              observaciones,
              creado_en
       FROM resenas
       WHERE usuario_id = ?
       ORDER BY id DESC`,
      [req.userId]
    );
    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: 'Error al listar reseñas' });
  }
});

// Obtener una reseña propia por ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id,
              nombre_restaurante,
              calificacion,
              DATE_FORMAT(fecha_visita, '%Y-%m-%d') AS fecha_visita,
              observaciones
       FROM resenas
       WHERE id = ? AND usuario_id = ?`,
      [req.params.id, req.userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Reseña no encontrada' });
    }

    return res.json(rows[0]);
  } catch (error) {
    return res.status(500).json({ message: 'Error al consultar la reseña' });
  }
});

// Crear una nueva reseña para el usuario autenticado
router.post('/', async (req, res) => {
  try {
    const { nombre_restaurante, calificacion, fecha_visita, observaciones } = req.body;

    if (!nombre_restaurante || calificacion === undefined || !fecha_visita) {
      return res.status(400).json({
        message: 'nombre_restaurante, calificacion y fecha_visita son obligatorios',
      });
    }

    const califNum = Number(calificacion);
    if (Number.isNaN(califNum) || califNum < 1 || califNum > 5) {
      return res.status(400).json({
        message: 'La calificación debe ser un número entre 1 y 5',
      });
    }

    const [result] = await pool.query(
      `INSERT INTO resenas (usuario_id, nombre_restaurante, calificacion, fecha_visita, observaciones)
       VALUES (?, ?, ?, ?, ?)`,
      [req.userId, nombre_restaurante.trim(), califNum, fecha_visita, observaciones || '']
    );

    return res.status(201).json({
      id: result.insertId,
      nombre_restaurante: nombre_restaurante.trim(),
      calificacion: califNum,
      fecha_visita,
      observaciones: observaciones || '',
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error al crear la reseña' });
  }
});

// Actualizar SOLO si la reseña pertenece a req.userId
router.put('/:id', async (req, res) => {
  try {
    const { nombre_restaurante, calificacion, fecha_visita, observaciones } = req.body;
    const califNum = Number(calificacion);

    if (!nombre_restaurante || Number.isNaN(califNum) || califNum < 1 || califNum > 5 || !fecha_visita) {
      return res.status(400).json({ message: 'Datos de reseña inválidos' });
    }

    const [result] = await pool.query(
      `UPDATE resenas
       SET nombre_restaurante = ?, calificacion = ?, fecha_visita = ?, observaciones = ?
       WHERE id = ? AND usuario_id = ?`,
      [nombre_restaurante.trim(), califNum, fecha_visita, observaciones || '', req.params.id, req.userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Reseña no encontrada o no pertenece al usuario' });
    }

    return res.json({
      id: Number(req.params.id),
      nombre_restaurante: nombre_restaurante.trim(),
      calificacion: califNum,
      fecha_visita,
      observaciones: observaciones || '',
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error al actualizar la reseña' });
  }
});

// Eliminar SOLO si la reseña pertenece a req.userId
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.query(
      'DELETE FROM resenas WHERE id = ? AND usuario_id = ?',
      [req.params.id, req.userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Reseña no encontrada o no pertenece al usuario' });
    }

    return res.json({ message: 'Reseña eliminada correctamente' });
  } catch (error) {
    return res.status(500).json({ message: 'Error al eliminar la reseña' });
  }
});

module.exports = router;