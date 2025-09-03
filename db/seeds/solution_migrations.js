exports.seed = async function(knex) {
  // Apaga tudo
  await knex('casos').del();
  await knex('agentes').del();

  // Insere agentes
  const agentesIds = await knex('agentes').insert([
    { nome: 'Rommel Carneiro', dataDeIncorporacao: '1992-10-04', cargo: 'delegado' },
    { nome: 'Ana Beatriz Silva', dataDeIncorporacao: '2005-06-17', cargo: 'inspetor' },
  ]).returning('id');

  // In some environments returning may be an array of objects, normalize ids
  const id1 = Array.isArray(agentesIds) ? agentesIds[0] : 1;
  const id2 = Array.isArray(agentesIds) ? agentesIds[1] : 2;

  // Insere casos
  await knex('casos').insert([
    {
      titulo: 'Homicídio no bairro União',
      descricao: 'Disparos foram reportados às 22:33 resultando em morte.',
      status: 'aberto',
      agente_id: id1
    },
    {
      titulo: 'Furto em estabelecimento comercial',
      descricao: 'Relatos de arrombamento durante a madrugada.',
      status: 'solucionado',
      agente_id: id2
    }
  ]);
};