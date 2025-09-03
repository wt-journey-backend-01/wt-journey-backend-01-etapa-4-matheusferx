const bcrypt = require('bcrypt');
exports.seed = async function(knex) {
  await knex('usuarios').del();
  const senhaHash = await bcrypt.hash('Senha@123', 10);
  await knex('usuarios').insert([
    { nome: 'Admin', email: 'admin@exemplo.com', senha: senhaHash }
  ]);
};