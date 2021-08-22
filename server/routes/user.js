import express from "express";
const router = express.Router();

import UsersCtrl from "../controllers/user";
import AuthCtrl from "../controllers/auth";

router.get("/me", AuthCtrl.onlyAuthUser, UsersCtrl.getCurrentUser);

router.post("/register", UsersCtrl.register);
router.post("/login", UsersCtrl.login);
router.post("/logout", UsersCtrl.logout);
router.post("/resetpassword", UsersCtrl.resetPassword);

module.exports = router;
