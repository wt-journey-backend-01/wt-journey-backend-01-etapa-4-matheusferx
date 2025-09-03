const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const usuariosRepository = require('../repositories/usuariosRepository');
const { badRequest } = require('../utils/errorHandler');

const SALT_ROUNDS = 10;

function isStrongPassword(pwd) {
  // 8+ chars, min 1 minúscula, 1 maiúscula, 1 número, 1 especial
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
  return re.test(pwd || '');
}

async function register(req, res) {
  const { nome, email, senha } = req.body;
  const errors = [];
  if (!nome) errors.push({ nome: "Campo 'nome' é obrigatório" });
  if (!email) errors.push({ email: "Campo 'email' é obrigatório" });
  if (!senha) errors.push({ senha: "Campo 'senha' é obrigatório" });
  if (senha && !isStrongPassword(senha)) {
    errors.push({
      senha:
        "A senha deve ter no mínimo 8 caracteres, com ao menos 1 minúscula, 1 maiúscula, 1 número e 1 caractere especial",
    });
  }
  if (errors.length) return badRequest(res, errors);

  const exists = await usuariosRepository.findByEmail(email);
  if (exists) {
    return res.status(400).json({
      status: 400,
      message: 'Parâmetros inválidos',
      errors: [{ email: 'E-mail já está em uso' }],
    });
  }

  const senhaHash = await bcrypt.hash(senha, SALT_ROUNDS);
  const user = await usuariosRepository.create({ nome, email, senhaHash });
  // por segurança, nunca retorne senha:
  delete user.senha;
  return res.status(201).json(user);
}

async function login(req, res) {
  const { email, senha } = req.body;
  if (!email || !senha) {
    return badRequest(res, [
      { email: "Campo 'email' é obrigatório" },
      { senha: "Campo 'senha' é obrigatório" },
    ]);
  }

  const user = await usuariosRepository.findByEmail(email);
  if (!user) {
    return res.status(401).json({ status: 401, message: 'Credenciais inválidas' });
  }

  const ok = await bcrypt.compare(senha, user.senha);
  if (!ok) {
    return res.status(401).json({ status: 401, message: 'Credenciais inválidas' });
  }

  const token = jwt.sign(
    { email: user.email },
    process.env.JWT_SECRET,
    { subject: String(user.id), expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
  );

  return res.status(200).json({ access_token: token });
}

async function logout(_req, res) {
  // Se usar blacklist/whitelist, invalide o token aqui (opcional).
  // Com JWT stateless, o "logout" do lado do servidor não faz nada; o front só descarta o token.
  return res.status(200).json({ message: 'Logout efetuado (stateless). Descarte o token no cliente.' });
}

// DELETE /users/:id (autodelete simples)
async function deleteUser(req, res) {
  const { id } = req.params;
  // Regra simples: o usuário só pode deletar a si mesmo
  if (String(req.user.id) !== String(id)) {
    return res.status(403).json({ status: 403, message: 'Você não pode excluir outro usuário' });
  }

  const user = await usuariosRepository.findById(id);
  if (!user) return res.status(404).send();

  await usuariosRepository.remove(id);
  return res.status(204).send();
}

module.exports = {
  register,
  login,
  logout,
  deleteUser,
};