const express = require("express")
const router = new express.Router() 
const util = require("../utilities")
const invController = require("../controllers/invController")
const invValidate = require("../utilities/inventory-validation")

router.get("/type/:classificationId", invController.buildByClassificationId);
router.get("/detail/:inventoryId", invController.buildByInventoryId);
router.get("/", invController.buildInventoryIndex);
router.get("/add-vehicle", invController.buildAddVehicle);
router.post("/add-vehicle", 
            invValidate.inventoryRules(),
            invValidate.checkInvData,
            util.handleErrors(invController.postVehicle));

module.exports = router;
