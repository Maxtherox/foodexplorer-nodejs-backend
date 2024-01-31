// Importa o arquivo de configuração do Knex. O caminho é relativo ao local deste arquivo.
const config = require('../../../knexfile');

// Importa o módulo 'knex', que é uma biblioteca SQL query builder para Node.js.
const knex = require("knex");

// Cria uma conexão usando a configuração específica para o ambiente de desenvolvimento.
const connection = knex(config.development);

// Exporta a conexão para ser usada em outros módulos.
module.exports = connection;