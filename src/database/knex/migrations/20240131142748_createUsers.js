exports.up = knex => knex.schema.createTable("users", table => {
    table.increments("id");
    table.string("name", 50).notNullable();
    table.text("email").notNullable();
    table.text("password").notNullable();
    table.text("avatar").defaultTo(null);
    table
    .enum("role", ["admin", "customer", "sale"], {useNative: true, enumName: "roles"})
    .notNullable().default("customer")
    table.timestamp("created_at").default(knex.fn.now());
    table.timestamp("updated_at").default(knex.fn.now());
})

exports.down = knex => knex.schema.dropTable("users");