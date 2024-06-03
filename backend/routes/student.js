const express= require("express");
const router= express.Router();
const {dashboard, updateProfile, uploadProfile, uploadResume, createProfile}= require("../controllers/studentController")

const {requireAuth} = require('../middleware/requireAuth')

const multer = require('multer')
const storage = multer.memoryStorage()

//middleware
const upload = multer({
    storage: storage
})
router.use(requireAuth)
router.get("/dashboard", dashboard);
router.put('/updateProfile', updateProfile);
router.post('/createProfile', createProfile);
router.post('/uploadProfile', upload.fields([
    { name: 'profilePicture', maxCount: 1 },
  ]),uploadProfile);

  router.post('/uploadResume', upload.fields([
    { name: 'resume', maxCount : 1}
  ]),uploadResume);

module.exports=router;