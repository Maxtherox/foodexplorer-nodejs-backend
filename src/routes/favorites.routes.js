const { Router } = require("express");
const FavoritesController = require('../controllers/FavoritesController');

const favoritesRoutes = Router()

const favoritesController = new FavoritesController();

// Rota para favoritar uma comida
favoritesRoutes.post('/', favoritesController.favorite);
favoritesRoutes.get('/:id', favoritesController.index);

module.exports = favoritesRoutes;
