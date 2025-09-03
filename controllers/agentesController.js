const agentesRepository = require('../repositories/agentesRepository');
const casosRepository = require('../repositories/casosRepository');
const { badRequest } = require('../utils/errorHandler');

function isValidDate(dateString) {
  // Formato YYYY-MM-DD
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) return false;
  const d = new Date(dateString);
  return !Number.isNaN(d.getTime());
}

async function index(req, res) {
  const { cargo, sort } = req.query;
  const agents = await agentesRepository.findAll({ cargo, sort });
  res.status(200).json(agents);
}

async function show(req, res) {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    return res.status(404).json({ message: "ID inválido" });
  }
  const agent = await agentesRepository.findById(id);
  if (!agent) return res.status(404).send();
  res.status(200).json(agent);
}

async function create(req, res) {
  const { nome, dataDeIncorporacao, cargo } = req.body;
  const errors = [];

  if (!nome) errors.push({ nome: "Campo 'nome' é obrigatório" });
  if (!dataDeIncorporacao || !isValidDate(dataDeIncorporacao)) {
    errors.push({ dataDeIncorporacao: "Campo dataDeIncorporacao deve seguir 'YYYY-MM-DD'" });
  }
  if (!cargo) errors.push({ cargo: "Campo 'cargo' é obrigatório" });

  if (errors.length) return badRequest(res, errors);

  const newAgent = await agentesRepository.create({ nome, dataDeIncorporacao, cargo });
  res.status(201).json(newAgent);
}

async function update(req, res) {
  const id = Number(req.params.id);
  const agentExists = await agentesRepository.findById(id);
  if (!agentExists) return res.status(404).send();

  const { nome, dataDeIncorporacao, cargo } = req.body;
  const errors = [];
  if (!nome) errors.push({ nome: "Campo 'nome' é obrigatório" });
  if (!dataDeIncorporacao || !isValidDate(dataDeIncorporacao)) {
    errors.push({ dataDeIncorporacao: "Campo dataDeIncorporacao deve seguir 'YYYY-MM-DD'" });
  }
  if (!cargo) errors.push({ cargo: "Campo 'cargo' é obrigatório" });

  if (errors.length) return badRequest(res, errors);

  const updated = await agentesRepository.update(id, { nome, dataDeIncorporacao, cargo });
  res.status(200).json(updated);
}

async function partialUpdate(req, res) {
  const id = Number(req.params.id);
  const agent = await agentesRepository.findById(id);
  if (!agent) return res.status(404).send();

  const payload = {};
  const errors = [];

  if (req.body.nome !== undefined) payload.nome = req.body.nome;
  if (req.body.cargo !== undefined) payload.cargo = req.body.cargo;
  if (req.body.dataDeIncorporacao !== undefined) {
    if (!isValidDate(req.body.dataDeIncorporacao)) {
      errors.push({ dataDeIncorporacao: "Campo dataDeIncorporacao deve seguir 'YYYY-MM-DD'" });
    } else {
      payload.dataDeIncorporacao = req.body.dataDeIncorporacao;
    }
  }

  if (errors.length) return badRequest(res, errors);

  const updated = await agentesRepository.update(id, { ...agent, ...payload });
  res.status(200).json(updated);
}

async function remove(req, res) {
  const id = Number(req.params.id);
  const agent = await agentesRepository.findById(id);
  if (!agent) return res.status(404).send();
  await agentesRepository.remove(id);
  res.status(204).send();
}

// Bonus: GET /agentes/:id/casos
async function getCasosByAgente(req, res) {
  const agenteId = Number(req.params.id);
  const agent = await agentesRepository.findById(agenteId);
  if (!agent) return res.status(404).send();

  const casos = await casosRepository.findByAgenteId(agenteId);
  res.status(200).json(casos);
}

module.exports = {
  index,
  show,
  create,
  update,
  partialUpdate,
  remove,
  getCasosByAgente
};
