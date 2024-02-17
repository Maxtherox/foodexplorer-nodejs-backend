const { Router } = require("express");

const FoodsController = require("../controllers/FoodsController")
const FoodAvatarController = require("../controllers/FoodAvatarController.js");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated")
const verifyUserAuthorization = require("../middlewares/verifyUserAuthorization");

const multer = require ("multer");
const uploadConfig = require("../configs/upload")

const foodsRoutes = Router();
const upload = multer(uploadConfig.MULTER);


foodsRoutes.use(ensureAuthenticated)

 const foodsController = new FoodsController()
 const foodAvatarController = new FoodAvatarController()

 foodsRoutes.post("/:user_id", verifyUserAuthorization("admin"), foodsController.create);
 foodsRoutes.get("/:id", foodsController.show);
 foodsRoutes.get("/", foodsController.index);
 foodsRoutes.delete("/:id", verifyUserAuthorization("admin"), foodsController.delete);
 foodsRoutes.put("/:id", verifyUserAuthorization("admin"), ensureAuthenticated, foodsController.update)
 foodsRoutes.patch("/:id", verifyUserAuthorization("admin"), ensureAuthenticated, upload.single("avatar"), foodAvatarController.update)

 module.exports = foodsRoutes;