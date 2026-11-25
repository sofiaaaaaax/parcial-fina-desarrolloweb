const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const resenasRoutes = require('./routes/resenas.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ status: 'API Reseñas de Restaurantes activa' });
});

app.use('/api/auth', authRoutes);
app.use('/api/resenas', resenasRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en http://localhost:${PORT}`);
});