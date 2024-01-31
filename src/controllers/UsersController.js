const { hash, compare} = require('bcryptjs');
const AppError = require("../utils/AppError");
const knex = require("../database/knex")

class UsersController {
    async create(request, response){
        const {name, email, password} = request.body;

        const checkUserExists = await knex("users").where({email});

        if (checkUserExists.length > 0){
            throw new AppError("Este e-mail já está em uso.");
        }
        if (name.length <= 0 || email.length <= 0 || password.length <= 0){
            throw new AppError("Não é possível inserir dados vazio.", 401);
        }
        const  hashedPassword = await hash(password, 8);

       await knex ("users").insert({name, email, password: hashedPassword})

        return response.status(201).json();
    }
    async update(request, response){
        const {name, email, password, old_password} = request.body;
        const {id} = request.params
        
        const user = await knex("users").where({id}).first();
        
        if(!user){
            throw new AppError("Usuário não encontrado.");
        }

        const userWithUpdatedEmail = await knex("users").where({email})
        console.log(user)
        console.log(userWithUpdatedEmail)
        if (userWithUpdatedEmail.email && userWithUpdatedEmail.id !== user.id){
            throw new AppError("E-mail já em uso.")
        }

        user.name = name ?? user.name;
        user.email = email ?? user.email;
        console.log(user)

        if(password && !old_password){
            throw new AppError("É necessário informar sua senha antiga para prosseguir.");
        }
        console.log(password)
        if(password && old_password){

            const checkOldPassword = await compare(old_password, user.password);
            console.log(user[0])

 
            
            if(!checkOldPassword){
                throw new AppError("Senha anterior incorreta.")
            }
            user.password = await hash(password, 8)
        }

        await knex("users")
            .update({name: user.name, email: user.email, password: user.password})
            .where({id})

        console.log(user)
        return response.status(201).json()
    }
    

}

module.exports = UsersController;