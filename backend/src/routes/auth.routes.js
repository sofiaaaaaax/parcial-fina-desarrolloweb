const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const router = express.Router();

// Registro de usuario
router.post('/register', async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({ message: 'Nombre, correo y contraseña requeridos' });
    }

    const [existing] = await pool.query('SELECT id FROM usuarios WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(409).json({ message: 'El correo ya está registrado' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO usuarios (nombre, email, password_hash) VALUES (?, ?, ?)',
      [nombre, email, passwordHash]
    );

    return res.status(201).json({
      id: result.insertId,
      nombre,
      email,
    });
  } catch (error) {
    console.error('Error en /register:', error);
    return res.status(500).json({ message: 'Error al registrar usuario' });
  }
});

// Inicio de sesión -> devuelve el token
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Correo y contraseña obligatorios' });
    }

    const [rows] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const user = rows[0];
    const hashGuardado = user.password_hash || user.password;

    if (!hashGuardado) {
      console.error('El usuario no tiene columna password_hash ni password:', user);
      return res.status(500).json({ message: 'Error de estructura en tabla usuarios' });
    }

    const passwordOk = await bcrypt.compare(password, hashGuardado);
    if (!passwordOk) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const secret = process.env.JWT_SECRET || 'clave_respaldo_temporal_2026';
    const token = jwt.sign(
      { id: user.id, email: user.email },
      secret,
      { expiresIn: '4h' }
    );

    return res.json({
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Error en /login:', error);
    return res.status(500).json({ message: 'Error al iniciar sesión' });
  }
});

module.exports = router;