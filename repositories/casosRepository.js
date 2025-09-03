const db = require('../db/db');

function findAll(filters = {}) {
  let query = db('casos').select('*');

  if (filters.agente_id) {
    query = query.where('agente_id', filters.agente_id);
  }

  if (filters.status) {
    query = query.where('status', filters.status);
  }

  if (filters.q) {
    const term = `%${filters.q}%`;
    query = query.where(function() {
      this.where('titulo', 'ilike', term).orWhere('descricao', 'ilike', term);
    });
  }

  return query;
}

function findById(id) {
  return db('casos').where({ id }).first();
}

async function create(caso) {
  const [id] = await db('casos').insert(caso).returning('id');
  return findById(id);
}

async function update(id, caso) {
  await db('casos').where({ id }).update(caso);
  return findById(id);
}

async function remove(id) {
  return db('casos').where({ id }).del();
}

async function findByAgenteId(agente_id) {
  return db('casos').where({ agente_id }).select('*');
}

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove,
  findByAgenteId
};