exports.up = knex => knex.schema.createTable("foods", table => {
    table.increments("id");
    table.text("name").notNullable();
    table.text("description").notNullable();
    table.float("value").notNullable();
    table.text("avatar").defaultTo(null);
    table.integer("user_id").references("id").inTable("users");
    table.timestamp("created_at").default(knex.fn.now());
    table.timestamp("updated_at").default(knex.fn.now());
})

exports.down = knex => knex.schema.dropTable("foods");