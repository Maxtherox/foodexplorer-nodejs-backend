const  { Router } = require ("express");

const CategoriesController = require("../controllers/CategoriesController");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated")

const categoriesRoutes= Router();

categoriesRoutes.use(ensureAuthenticated)

const categoriesController = new CategoriesController();

categoriesRoutes.get("/", categoriesController.index)

module.exports = categoriesRoutes;