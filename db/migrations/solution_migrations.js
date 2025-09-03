exports.up = async function(knex) {
  // Cria tabela agentes
  await knex.schema.createTable('agentes', function(table) {
    table.increments('id').primary(); // integer auto-increment
    table.string('nome').notNullable();
    table.date('dataDeIncorporacao').notNullable();
    table.string('cargo').notNullable();
  });

  // Cria tabela casos
  await knex.schema.createTable('casos', function(table) {
    table.increments('id').primary();
    table.string('titulo').notNullable();
    table.text('descricao').notNullable();
    table.enu('status', ['aberto', 'solucionado']).notNullable().defaultTo('aberto');
    table.integer('agente_id').unsigned().notNullable();
    table.foreign('agente_id').references('agentes.id').onDelete('CASCADE');
  });
};

exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('casos');
  await knex.schema.dropTableIfExists('agentes');
};
