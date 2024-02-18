const { Router } = require("express");

const FoodsController = require("../controllers/FoodsController")
const ensureAuthenticated = require("../middlewares/ensureAuthenticated")
const verifyUserAuthorization = require("../middlewares/verifyUserAuthorization");

const multer = require ("multer");
const uploadConfig = require("../configs/upload")

const foodsRoutes = Router();
const upload = multer(uploadConfig.MULTER);


foodsRoutes.use(ensureAuthenticated)

 const foodsController = new FoodsController()


 foodsRoutes.post("/", verifyUserAuthorization("admin"), upload.single("avatar"), foodsController.create);
 foodsRoutes.get("/:id", foodsController.show);
 foodsRoutes.get("/", foodsController.index);
 foodsRoutes.delete("/:id", verifyUserAuthorization("admin"), foodsController.delete);
 foodsRoutes.put("/:id", verifyUserAuthorization("admin"), ensureAuthenticated, foodsController.update)


 module.exports = foodsRoutes;