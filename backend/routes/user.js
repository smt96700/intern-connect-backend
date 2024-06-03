const express= require("express");
const router= express.Router();
const {verifyEmail, login, resetPassword, logout, getAdmin, validUser, updatePassword, searchStudent}= require("../controllers/userController");

router.post("/verifyEmail", verifyEmail)
router.post("/login", login)
router.put("/resetPassword", resetPassword);
router.get("/logout", logout)
router.get("/getAdmin", getAdmin);
router.post("/validUser", validUser);
router.put("/updatePassword", updatePassword)
router.get("/searchStudent", searchStudent)
module.exports=  router;