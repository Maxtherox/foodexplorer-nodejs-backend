exports.up = knex => knex.schema.createTable("categories", table => {
    table.increments("id");
    table.text("name").notNullable();
    table.integer("food_id").references("id").inTable("foods");
    table.integer("user_id").references("id").inTable("users");
})

exports.down = knex => knex.schema.dropTable("categories");