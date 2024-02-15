const { Router } = require("express");

const FoodsController = require("../controllers/FoodsController")
const ensureAuthenticated = require("../middlewares/ensureAuthenticated")

const foodsRoutes = Router();
foodsRoutes.use(ensureAuthenticated)

 const foodsController = new FoodsController()

 foodsRoutes.post("/:user_id", foodsController.create);
 foodsRoutes.get("/:id", foodsController.show);
 foodsRoutes.get("/", foodsController.index);
 foodsRoutes.delete("/:id", foodsController.delete);

 module.exports = foodsRoutes;