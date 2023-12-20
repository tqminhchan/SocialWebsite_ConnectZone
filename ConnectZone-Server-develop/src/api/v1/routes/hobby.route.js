const Router = require("express").Router();

const hobbyController = require("../controllers/hobby.controller");
const verifyToken = require("../middlewares/verifyToken");

Router.get("/get-all-hobby", verifyToken, hobbyController.getAllHobbies);
Router.put("/update-hobbies-user", verifyToken, hobbyController.updateHobbiesUser);
Router.get("/get-hobby-user", verifyToken, hobbyController.getListHobbyUser);

module.exports = Router;
