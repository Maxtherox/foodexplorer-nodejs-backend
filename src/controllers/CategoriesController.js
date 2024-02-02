const knex = require ("../database/knex");

class CategoriesController{
    async index(request, response){
        const {user_id} = request.params;

        const categories = await knex("categories").where({user_id})

        return response.json(categories)
    }
}

module.exports = CategoriesController