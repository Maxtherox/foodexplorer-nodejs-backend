const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class FoodsController{
    async create(request, response){
        const {name, description, price, ingredients, categories} = request.body;
        const {user_id} = request.params;
        console.log(categories)
        const checkPrice = price;

        if (typeof checkPrice != 'number'){
            throw new AppError("Só é permitido caracteres númericos no campo relacionado a preço.", 401)
        }
        const [food_id] = await knex("foods").insert({
            name,
            description,
            price,
            user_id
        })
        
        const ingredientsInsert = ingredients.map(name => {
            return {
                name,
                food_id,
                user_id
            }
        })

       const categoriesInsert = categories.map(name => {
            return{
                name,
                food_id,
                user_id
            }
       })

        await knex("ingredients").insert(ingredientsInsert)
        await knex("categories").insert(categoriesInsert)

        response.status(201).json("Prato adicionado com sucesso!")
    }

    async show(request, response){
        const {id} = request.params;

        const food = await knex("foods").where({id}).first()
        console.log(food)

        const ingredients = await knex("ingredients").where({food_id: id}).orderBy("name")
        const categories = await knex("categories").where({food_id: id}).orderBy("name")
        return response.json({
            ...food,
            ingredients,
            categories
        });
    }
    
    async delete (request, response){
        const {id} = request.params

        await knex("foods").where({id}).delete()

        return response.json("deletado com sucesso.");
    }

    async index(request, response){
        const {name, user_id, ingredients} = request.query


        console.log(user_id)
        let foodsQuery;

        if(ingredients){
            const { name, user_id, ingredients } = request.query;

            let foods;
        
            if (ingredients) {
              const filterIngredients = ingredients.split(',').map(ingredient => ingredient.trim());
        
              foods = await knex("foods")
                .select([
                  "foods.id as food_id", // Renomeie o campo id para evitar ambiguidade
                  "foods.name",
                  "foods.user_id"
                ])
                .where("foods.user_id", user_id)
                .whereLike("foods.name", `${name}`)
                .whereIn("foods.name", filterIngredients) // Corrija para usar "foods.name"
                .innerJoin("ingredients", "foods.id", "ingredients.food_id")
                .groupBy("foods.id")
                .orderBy("foods.name");
            } else {
              foods = await knex("foods")
                .where({ user_id })
                .whereLike("name", `${name}`)
                .orderBy("name");
            }
        
            const userIngredients = await knex("ingredients").where({ user_id });
        
            const foodsWithIngredients = foods.map(food => {
              const foodIngredients = userIngredients.filter(ingredient => ingredient.food_id === food.food_id); // Corrija para usar "food.food_id"
              return {
                ...food,
                ingredients: foodIngredients
              };
            });
        
            return response.json(foodsWithIngredients);
        }}
}

module.exports = FoodsController