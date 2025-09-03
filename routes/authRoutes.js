const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Registra um novo usuário
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nome, email, senha]
 *             properties:
 *               nome: { type: string }
 *               email: { type: string, format: email }
 *               senha: { type: string, format: password }
 *     responses:
 *       201: { description: Usuário criado }
 *       400: { description: Parâmetros inválidos }
 */
router.post('/auth/register', authController.register);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Faz login e retorna um access token (JWT)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, senha]
 *             properties:
 *               email: { type: string, format: email }
 *               senha: { type: string, format: password }
 *     responses:
 *       200:
 *         description: Token retornado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 access_token: { type: string }
 *       401: { description: Credenciais inválidas }
 */
router.post('/auth/login', authController.login);

/**
 * @openapi
 * /auth/logout:
 *   post:
 *     summary: Efetua logout (stateless)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: Logout efetuado }
 *       401: { description: Token ausente/ inválido }
 */
router.post('/auth/logout', authMiddleware, authController.logout);

/**
 * @openapi
 * /users/{id}:
 *   delete:
 *     summary: Exclui o próprio usuário
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204: { description: Removido }
 *       403: { description: Proibido excluir outro usuário }
 *       404: { description: Usuário não encontrado }
 */
router.delete('/users/:id', authMiddleware, authController.deleteUser);

module.exports = router;