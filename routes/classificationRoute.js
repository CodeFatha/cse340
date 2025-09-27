const express = require("express")
const router = new express.Router() 
const classController = require("../controllers/classificationController")

router.get("/add", classController.buildAddClassification);
router.post("/add", classController.postClassification);

module.exports = router;