const express = require("express");
const loginController = require("../controllers/loginController");
const registerController = require("../controllers/registerController");
const transactionController = require("../controllers/transactionController");
const router = express.Router();

router.post("/login",loginController.loginMiddleware,loginController.getLogin);
router.post("/register",registerController.regisCon);
router.get("/transaction",loginController.requireJWTAuth,transactionController.getTransByUsername);
router.post("/regisApi",registerController.keyAndVerify);
router.get("/getUserInformation",loginController.requireJWTAuth,loginController.getUserInfo);

module.exports = router;