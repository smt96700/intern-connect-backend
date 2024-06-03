const express= require('express');
const router= express.Router();
const {getAllJobs, postJob, updateJob, deleteJob, getSingleJob, getMyJobs}= require('../controllers/jobController')

const {requireAuth}= require('../middleware/requireAuth');

router.use(requireAuth);
router.get("/getAllJobs", getAllJobs);
router.get("/getMyJobs", getMyJobs);
router.get("/singleJob/:id", getSingleJob);
router.post("/postJob", postJob);
router.put("/updateJob/:id", updateJob);
router.delete("/deleteJob/:id", deleteJob);
module.exports= router