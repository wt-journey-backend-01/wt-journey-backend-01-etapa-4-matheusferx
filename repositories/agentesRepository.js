const db = require('../db/db');

async function findAll(filters = {}) {
  let query = db('agentes').select('*');

  if (filters.cargo) {
    query = query.where('cargo', filters.cargo);
  }

  if (filters.sort === 'dataDeIncorporacao') {
    query = query.orderBy('dataDeIncorporacao', 'asc');
  } else if (filters.sort === '-dataDeIncorporacao') {
    query = query.orderBy('dataDeIncorporacao', 'desc');
  }

  return query;
}

function findById(id) {
  return db('agentes').where({ id }).first();
}

async function create(agent) {
  const [id] = await db('agentes').insert(agent).returning('id');
  return findById(id);
}

async function update(id, agent) {
  await db('agentes').where({ id }).update(agent);
  return findById(id);
}

async function remove(id) {
  return db('agentes').where({ id }).del();
}

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove
};