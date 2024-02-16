const { Router } = require("express");

const FoodsController = require("../controllers/FoodsController")
const FoodAvatarController = require("../controllers/FoodAvatarController.js");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated")

const multer = require ("multer");
const uploadConfig = require("../configs/upload")

const foodsRoutes = Router();
const upload = multer(uploadConfig.MULTER);

foodsRoutes.use(ensureAuthenticated)

 const foodsController = new FoodsController()
 const foodAvatarController = new FoodAvatarController()

 foodsRoutes.post("/:user_id", foodsController.create);
 foodsRoutes.get("/:id", foodsController.show);
 foodsRoutes.get("/", foodsController.index);
 foodsRoutes.delete("/:id", foodsController.delete);
 foodsRoutes.put("/:id", ensureAuthenticated, foodsController.update)
 foodsRoutes.patch("/:id", ensureAuthenticated, upload.single("avatar"), foodAvatarController.update)

 module.exports = foodsRoutes;