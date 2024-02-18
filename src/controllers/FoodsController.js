const knex = require("../database/knex");
const AppError = require("../utils/AppError");
const DiskStorage = require("../providers/DiskStorage")

class FoodsController{
    async create(request, response){
        const {name, description, price, ingredients, categories} = request.body;
        const user_id = request.user.id
        console.log(request.body);

        /*const checkPrice = price;

        if (typeof checkPrice != 'number'){
            throw new AppError("Só é permitido caracteres númericos no campo relacionado a preço.", 401)
        }*/
        const checkFoodAlreadyExists = await knex("foods").where({name}).first();
    
        if(checkFoodAlreadyExists){
            throw new AppError("Este prato já existe no cardápio.")
        }

        const avatarFileName = request.file.filename;

        const diskStorage = new DiskStorage()

        const filename = await diskStorage.saveFile(avatarFileName);

        const [food_id] = await knex("foods").insert({
            avatar: filename,
            name,
            description,
            price,
            user_id
        })
        
        const hasOnlyOneIngredient = typeof(ingredients) === "string";

        let ingredientsInsert

        if (hasOnlyOneIngredient) {
            ingredientsInsert = {
                name: ingredients,
                food_id
            }

        } else if (ingredients.length > 1) {
            ingredientsInsert = ingredients.map(name => {
                return {
                    name,
                    food_id
                }
            });
          }
       const categoriesArray = Array.isArray(categories) ? categories : [categories];

       const categoriesInsert = categoriesArray.map(name => {
        return {
            name,
            food_id,
            user_id
        };
    });
    

        await knex("ingredients").insert(ingredientsInsert)
        await knex("categories").insert(categoriesInsert)

        response.status(201).json("Prato adicionado com sucesso!")
    }

    async update(request, response){
        const { name, description, price, ingredients, categories } = request.body;
        const { id } = request.params;
        
        const food = await knex("foods").where({ id }).first();
        
        if (!food) {
            throw new AppError("Prato não encontrado");
        }
        
        // Etapa 1: Atualizar a tabela 'ingredients'
        if (ingredients) {
            await knex("ingredients")
                .where({ food_id: id }) // Assumindo que a chave estrangeira em 'ingredients' é 'food_id'
                .del(); // Exclui todos os registros associados a essa comida
        
            // Insere os novos ingredientes
            const ingredientsData = ingredients.map(ingredient => ({ food_id: id, name: ingredient }));
            await knex("ingredients").insert(ingredientsData);
        }
        
        // Etapa 2: Atualizar a tabela 'categories'
        // Etapa 2: Atualizar a tabela 'categories'
        if (categories) {
            await knex("categories")
                .where({ food_id: id }) // Assumindo que a chave estrangeira em 'categories' é 'food_id'
                .del(); // Exclui todas as categorias associadas a essa comida

            // Insere as novas categorias
            const categoriesData = categories.map(category => ({ food_id: id, name: category }));
            await knex("categories").insert(categoriesData);
        }

        
        // Etapa 3: Atualizar a tabela 'foods'
        const formattedDate = new Date().toISOString().slice(0, 19).replace("T", " ");
        await knex("foods")
            .where({ id })
            .update({ name, description, price, updated_at: formattedDate });
        
        return response.status(200).json();

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