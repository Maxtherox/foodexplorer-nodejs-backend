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

    async index(request, response) {
        try {
          const { name, ingredients, categories } = request.query;
      
          let foodsQuery = knex("foods")
            .select([
              "foods.id",
              "foods.name",
              "foods.user_id",
              "foods.description",
              "categories.name as category",
            ])
            .leftJoin("categories", "foods.id", "categories.food_id") // Ajustado para usar a tabela categories
            .groupBy("foods.id")
            .orderBy("foods.name");
      
          if (name) {
            foodsQuery = foodsQuery.whereLike("foods.name", `%${name}%`);
          }
      
          if (categories) {
            const filterCategories = categories.split(',').map(category => category.trim());
      
            foodsQuery = foodsQuery
              .whereIn("categories.name", filterCategories);
          }
      
          if (ingredients) {
            const filterIngredients = ingredients.split(',').map(ingredient => ingredient.trim());
      
            foodsQuery = foodsQuery
              .whereIn("foods.id", function () {
                this.select("food_id")
                  .from("ingredients")
                  .whereIn("name", filterIngredients);
              });
          }
      
          const foods = await foodsQuery;
      
          const userIngredients = await knex("ingredients")
            .select([
              "ingredients.id",
              "ingredients.food_id",
              "ingredients.name",
              // adicione outras colunas conforme necessário
            ])
            .whereIn("food_id", foods.map(food => food.id));
      
          const foodsWithIngredients = foods.map(food => {
            const foodIngredients = userIngredients.filter(ingredient => ingredient.food_id === food.id);
            return {
              ...food,
              ingredients: foodIngredients,
            };
          });
      
          return response.json(foodsWithIngredients);
        } catch (error) {
          console.error(error);
          return response.status(500).json({ error: 'Erro interno do servidor.' });
        }
      }
      
}

module.exports = FoodsController