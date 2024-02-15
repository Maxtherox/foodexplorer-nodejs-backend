const knex = require ("../database/knex");

class CategoriesController{
    async index(request, response){

        const categories = await knex("categories")

        return response.json(categories)
    }
}

module.exports = CategoriesController