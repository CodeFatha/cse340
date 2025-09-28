const express = require("express")
const router = new express.Router() 
const classController = require("../controllers/classificationController")
const classValidate = require("../utilities/classification-validation")

router.get("/add", classController.buildAddClassification);
router.post("/add", 
            classValidate.classificationRules(),
            classValidate.checkInvData,
            classController.postClassification);
 
module.exports = router;