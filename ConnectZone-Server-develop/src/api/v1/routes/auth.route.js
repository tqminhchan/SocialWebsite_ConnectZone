const Router = require("express").Router();

const authController = require("../controllers/auth.controller");
const verifyToken = require("../middlewares/verifyToken");

Router.post("/register", authController.handleRegister);
Router.post("/login", authController.handleLogin);
Router.get("/me", verifyToken, authController.getCurrentUser);

module.exports = Router;
