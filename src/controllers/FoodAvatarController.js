const knex = require("../database/knex");
const AppError = require("../utils/AppError");
const DiskStorage = require("../providers/DiskStorage");

class FoodAvatarController {
    async update(request, response) {
        const food_id = request.params.id
        const avatarFilename = request.file.filename;

        const diskStorage = new DiskStorage();

        const food = await knex("foods")
        .where({ id: food_id }).first();

        if (!food) {
            throw new AppError("Somente usuários autenticados podem mudar o avatar.", 401)
        }

        if (food.avatar){
            await diskStorage.deleteFile(food.avatar)
        }

        const filename = await diskStorage.saveFile(avatarFilename);
        food.avatar = filename;
        const formattedDate = new Date().toISOString().slice(0, 19).replace("T", " ");

        await knex("foods").update(food).where({ id: food_id });  
        await knex("foods")
            .where({id: food_id})
            .update({updated_at: formattedDate });
        
        return response.json(food);
    }
}

module.exports = FoodAvatarController;