const express= require("express");
const { reset_password_message, get_messages } = require("../controllers/anonymousController");
const router= express.Router();
router.post("/reset_password_message", reset_password_message);
router.post("/get_messages", get_messages)

module.exports= router;