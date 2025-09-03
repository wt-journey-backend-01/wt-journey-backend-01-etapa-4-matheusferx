require('dotenv').config();
const express = require('express');
const app = express();

const authRoutes = require('./routes/authRoutes');
const agentesRoutes = require('./routes/agentesRoutes');
const casosRoutes = require('./routes/casosRoutes');
const authMiddleware = require('./middlewares/authMiddleware');

const PORT = process.env.PORT || 3000;

app.use(express.json());

// Rotas públicas de auth
app.use(authRoutes);

// Rotas protegidas
app.use('/agentes', authMiddleware, agentesRoutes);
app.use('/casos', authMiddleware, casosRoutes);

// (Opcional) handler global de erro
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ status: 500, message: 'Erro interno' });
});

app.listen(PORT, () => {
  console.log(`Servidor do Departamento de Polícia rodando em http://localhost:${PORT}`);
});