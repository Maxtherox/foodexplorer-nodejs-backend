const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class UsersValidatedController {
  async index(request, response) {
    const { user } = request;

    // Adicione uma verificação para garantir que 'user' não seja undefined
    if (!user || !user.id) {
      console.log("O objeto 'user' está undefined ou não possui a propriedade 'id'.");
      throw new AppError("Unauthorized, mensagem de uservalidatedController", 401);
    }

    const checkUserExists = await knex("users").where({ id: user.id });

    if (checkUserExists.length === 0) {
      console.log("Usuário não encontrado no banco de dados.");
      throw new AppError("Unauthorized, mensagem de uservalidatedController", 401);
    }

    return response.status(200).json();
  }
}

module.exports = UsersValidatedController;
