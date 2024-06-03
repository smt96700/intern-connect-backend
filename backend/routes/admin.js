const express= require("express")
const router= express.Router();
const {dashboard, addStudent, deductCredit, updateProfile, createProfile}= require("../controllers/adminController")
//adding a student 
const {requireAuth} = require('../middleware/requireAuth')

router.use(requireAuth)
router.get("/dashboard", dashboard)
router.post("/addstudent", addStudent);
router.put("/deductcredit", deductCredit);
router.put("/updateProfile", updateProfile);
router.post('/createProfile', createProfile);
module.exports= router