const casosRepository = require('../repositories/casosRepository');
const agentesRepository = require('../repositories/agentesRepository');
const { badRequest } = require('../utils/errorHandler');

function isValidStatus(status) {
  return status === 'aberto' || status === 'solucionado';
}

// controllers/casosController.js
async function index(req, res) {
  const { agente_id, status, q } = req.query;

  if (status && !['aberto', 'fechado', 'em_andamento'].includes(status)) {
    return res.status(400).json({ message: 'Status inválido' });
  }

  if (agente_id && isNaN(Number(agente_id))) {
    return res.status(400).json({ message: 'agente_id inválido' });
  }

  const casos = await casosRepository.findAll({ agente_id, status, q });
  res.status(200).json(casos);
}

async function show(req, res) {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    return res.status(404).json({ message: "ID inválido" });
  }
  const caso = await casosRepository.findById(id);
  if (!caso) return res.status(404).send();
  res.status(200).json(caso);
}

async function create(req, res) {
  const { titulo, descricao, status, agente_id } = req.body;
  const errors = [];

  if (!titulo) errors.push({ titulo: "Campo 'titulo' é obrigatório" });
  if (!descricao) errors.push({ descricao: "Campo 'descricao' é obrigatório" });
  if (!status || !isValidStatus(status)) errors.push({ status: "O campo 'status' pode ser somente 'aberto' ou 'solucionado'" });
  if (!agente_id) errors.push({ agente_id: "Campo 'agente_id' é obrigatório" });

  if (errors.length) return badRequest(res, errors);

  // Verifica existência do agente
  const agent = await agentesRepository.findById(Number(agente_id));
  if (!agent) return res.status(404).json({ status: 404, message: 'Agente não encontrado' });

  const newCaso = await casosRepository.create({ titulo, descricao, status, agente_id: Number(agente_id) });
  res.status(201).json(newCaso);
}

async function update(req, res) {
  const id = Number(req.params.id);
  const existing = await casosRepository.findById(id);
  if (!existing) return res.status(404).send();

  const { titulo, descricao, status, agente_id } = req.body;
  const errors = [];
  if (!titulo) errors.push({ titulo: "Campo 'titulo' é obrigatório" });
  if (!descricao) errors.push({ descricao: "Campo 'descricao' é obrigatório" });
  if (!status || !isValidStatus(status)) errors.push({ status: "O campo 'status' pode ser somente 'aberto' ou 'solucionado'" });
  if (!agente_id) errors.push({ agente_id: "Campo 'agente_id' é obrigatório" });

  if (errors.length) return badRequest(res, errors);

  const agent = await agentesRepository.findById(Number(agente_id));
  if (!agent) return res.status(404).json({ status: 404, message: 'Agente não encontrado' });

  const updated = await casosRepository.update(id, { titulo, descricao, status, agente_id: Number(agente_id) });
  res.status(200).json(updated);
}

async function partialUpdate(req, res) {
  const id = Number(req.params.id);
  const existing = await casosRepository.findById(id);
  if (!existing) return res.status(404).send();

  const payload = {};
  const errors = [];

  if (req.body.titulo !== undefined) payload.titulo = req.body.titulo;
  if (req.body.descricao !== undefined) payload.descricao = req.body.descricao;
  if (req.body.status !== undefined) {
    if (!isValidStatus(req.body.status)) errors.push({ status: "O campo 'status' pode ser somente 'aberto' ou 'solucionado'" });
    else payload.status = req.body.status;
  }
  if (req.body.agente_id !== undefined) {
    const agent = await agentesRepository.findById(Number(req.body.agente_id));
    if (!agent) errors.push({ agente_id: "Agente informado não existe" });
    else payload.agente_id = Number(req.body.agente_id);
  }

  if (errors.length) return badRequest(res, errors);

  const updated = await casosRepository.update(id, { ...existing, ...payload });
  res.status(200).json(updated);
}

async function remove(req, res) {
  const id = Number(req.params.id);
  const existing = await casosRepository.findById(id);
  if (!existing) return res.status(404).send();
  await casosRepository.remove(id);
  res.status(204).send();
}

// Bonus: GET /casos/:caso_id/agente -> retorna dados do agente do caso
async function getAgenteByCaso(req, res) {
  const casoId = Number(req.params.caso_id);
  const caso = await casosRepository.findById(casoId);
  if (!caso) return res.status(404).send();

  const agente = await agentesRepository.findById(Number(caso.agente_id));
  if (!agente) return res.status(404).send();

  res.status(200).json(agente);
}

module.exports = {
  index,
  show,
  create,
  update,
  partialUpdate,
  remove,
  getAgenteByCaso
};
