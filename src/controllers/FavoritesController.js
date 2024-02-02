const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class FavoritesController {
  async favorite(request, response) {
    try {
      const { user_id, food_id } = request.body;

      // Verifique se a comida já foi favoritada pelo usuário
      const favoriteExist = await knex('favorites')
        .where({ user_id, food_id })
        .first();

      if (favoriteExist) {
        return response.status(400).json({ error: 'Comida já favoritada pelo usuário.' });
      }
      
      const foodCheck = await knex('foods')
      .where('id', food_id).first()

      if(!foodCheck){
        return response.status(400).json({ error: 'Comida não encontrada'})
      }

      const userCheck = await knex ("users").where('id', user_id).first()
      if(!userCheck){
        return response.status(400).json({ error: 'Usuário não encontrado.'})
      }

      // Insira o favorito na tabela 'favorites'
      await knex('favorites').insert({ user_id, food_id });

      return response.status(201).json({ message: 'Comida favoritada com sucesso.' });
    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: 'Erro interno do servidor.' });
    }
  }
  async index (request, response) {
    try {
        const { id } = request.params;
  
        // Verifique se o usuário existe
        const userExist = await knex('users').where('id', id).first();
  
        if (!userExist) {
          return response.status(404).json({ error: 'Usuário não encontrado.' });
        }
  
        // Consulte os favoritos do usuário
        const favorites = await knex('favorites')
          .where('favorites.user_id', id)
          .join('foods', 'favorites.food_id', '=', 'foods.id')
          .select('foods.*', 'favorites.id as favorite_id');
  
        return response.json(favorites);
      } catch (error) {
        console.error(error);
        return response.status(500).json({ error: 'Erro interno do servidor.' });
      }
  }
}
module.exports = FavoritesController;
