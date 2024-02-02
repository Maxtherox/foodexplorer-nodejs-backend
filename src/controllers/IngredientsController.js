const knex = require ("../database/knex");

class IngredientsController{
    async index(request, response){
        const {user_id} = request.params;

        const ingredients = await knex("ingredients")
        .where({user_id})
        .groupBy("name")

        return response.json(ingredients)
    }
}

module.exports = IngredientsController