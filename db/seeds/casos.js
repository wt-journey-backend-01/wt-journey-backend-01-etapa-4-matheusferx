exports.seed = async function(knex) {
  await knex('casos').del();
  // Pegue os IDs dos agentes já inseridos
  const agentes = await knex('agentes').select('id');
  await knex('casos').insert([
    {
      titulo: 'Homicídio no bairro União',
      descricao: 'Disparos foram reportados às 22:33 resultando em morte.',
      status: 'aberto',
      agente_id: agentes[0].id
    },
    {
      titulo: 'Furto em estabelecimento comercial',
      descricao: 'Relatos de arrombamento durante a madrugada.',
      status: 'solucionado',
      agente_id: agentes[1].id
    }
  ]);
};