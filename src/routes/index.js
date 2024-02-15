const { Router } = require("express") ;

const usersRouter = require("./users.routes");
const ingredientsRouter = require("./ingredients.routes");
const foodsRouter = require("./foods.routes");
const categoriesRoutes = require("./categories.routes");
const favoritesRoutes = require("./favorites.routes");
const sessionsRouter = require("./sessions.routes");


const routes = Router();

routes.use("/sessions", sessionsRouter);
routes.use("/users", usersRouter);
routes.use("/foods", foodsRouter);
routes.use("/ingredients", ingredientsRouter);
routes.use("/categories", categoriesRoutes);
routes.use("/favorites", favoritesRoutes);


module.exports = routes;