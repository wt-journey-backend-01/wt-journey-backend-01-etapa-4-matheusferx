exports.seed = async function(knex) {
  await knex('agentes').del();
  await knex('agentes').insert([
    { nome: 'Rommel Carneiro', dataDeIncorporacao: '1992-10-04', cargo: 'delegado' },
    { nome: 'Ana Beatriz Silva', dataDeIncorporacao: '2005-06-17', cargo: 'inspetor' },
  ]);
};