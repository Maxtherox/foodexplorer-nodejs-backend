const knex = require("../database/knex");
const AppError = require("../utils/AppError");
const DiskStorage = require("../providers/DiskStorage")

class FoodsController{
    async create(request, response){
        const {name, description, price, ingredients, category} = request.body;
        const user_id = request.user.id

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
            category,
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

        await knex("ingredients").insert(ingredientsInsert)

        response.status(201).json("Prato adicionado com sucesso!")
    }

    async update(request, response){
        const { name, description, price, ingredients, category, avatar } = request.body;
        const { id } = request.params;

        

        const food = await knex("foods").where({ id }).first();
        
        
        if (!food) {
            throw new AppError("Prato não encontrado");
        }

        const diskStorage = new DiskStorage();  
        
        let avatarFileName

        if(request.file){
            avatarFileName = request.file.filename;

            if (food.avatar){
                await diskStorage.deleteFile(food.avatar);
            }
        }

        const filename = avatarFileName ? await diskStorage.saveFile(avatarFileName) : food.avatar;


        food.avatar = avatarFileName ? filename : food.avatar;
        food.name = name ?? food.name;
        food.description = description ?? food.description;
        food.category = category ?? food.category;
        food.price = price ?? food.price;

        await knex("foods").where({ id }).update(food);


        await knex("ingredients").where({ food_id: id }).delete();

        const hasOnlyOneIngredient = typeof ingredients === "string";

        let ingredientsInsert;

        if (hasOnlyOneIngredient) {
            ingredientsInsert = {
                name: ingredients,
                food_id: food.id,
            };
        } else if (ingredients.length > 1) {
            ingredientsInsert = ingredients.map((ingredient) => {
                return {
                    food_id: food.id,
                    name: ingredient,
                };
            });
        }

        await knex("ingredients").insert(ingredientsInsert);

        return response.status(201).json('Prato atualizado com sucesso');


    }

    async show(request, response){
        const {id} = request.params;

        const food = await knex("foods").where({id}).first();

        const ingredients = await knex("ingredients").where({food_id: id}).orderBy("name");
        return response.json({
            ...food,
            ingredients
        });
    }
    
    async delete (request, response){
        const {id} = request.params

        await knex("foods").where({id}).delete()

        return response.json("deletado com sucesso.");
    }

    async index(request, response) {
               // Capturing Query Parameters
        const { name, ingredients } = request.query;

        let foods;

        if (ingredients) {
            const filterIngredients = ingredients.split(',').map(ingredient => ingredient.trim());
            
            foods = await knex("ingredients")
                .select([
                    "foods.id",
                    "foods.name",
                    "foods.description",
                    "foods.category",
                    "foods.price",
                    "foods.avatar",
                ])
                .whereLike("foods.name", `%${name}%`)
                .whereIn("name", filterIngredients)
                .innerJoin("foods", "foods.id", "ingredients.food_id")
                .groupBy("foods.id")
                .orderBy("foods.name")
        } else {
            foods = await knex("foods")
                .whereLike("name", `%${name}%`)
                .orderBy("name");
        }
            
        const foodsIngredients = await knex("ingredients") 
        const foodsWithIngredients = foods.map(food => {
            const foodIngredient = foodsIngredients.filter(ingredient => ingredient.food_id === food.id);
    
            return {
                ...food,
                ingredients: foodIngredient
            }
        })
        
        return response.status(200).json(foodsWithIngredients);
    }
      
}

module.exports = FoodsController