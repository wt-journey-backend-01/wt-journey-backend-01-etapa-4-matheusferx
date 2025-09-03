const db = require('../db/db');

function findByEmail(email) {
  return db('usuarios').where({ email }).first();
}

function findById(id) {
  return db('usuarios').where({ id }).first();
}

async function create({ nome, email, senhaHash }) {
  const [id] = await db('usuarios')
    .insert({ nome, email, senha: senhaHash })
    .returning('id');
  return findById(typeof id === 'object' ? id.id : id);
}

async function remove(id) {
  return db('usuarios').where({ id }).del();
}

module.exports = {
  findByEmail,
  findById,
  create,
  remove,
};