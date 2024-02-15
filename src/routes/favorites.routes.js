const { Router } = require("express");
const FavoritesController = require('../controllers/FavoritesController');
const ensureAuthenticated = require("../middlewares/ensureAuthenticated")
const favoritesRoutes = Router()

const favoritesController = new FavoritesController();
favoritesRoutes.use(ensureAuthenticated)
// Rota para favoritar uma comida
favoritesRoutes.post('/', favoritesController.favorite);
favoritesRoutes.get('/:id', favoritesController.index);

module.exports = favoritesRoutes;
