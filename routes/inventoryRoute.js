const express = require("express")
const router = new express.Router() 
const util = require("../utilities")
const invController = require("../controllers/invController")
const invValidate = require("../utilities/inventory-validation")

router.get("/type/:classificationId", invController.buildByClassificationId);
router.get("/detail/:inventoryId", invController.buildByInventoryId);
router.get("/", invController.buildInventoryIndex);
router.get("/add-vehicle", invController.buildAddVehicle);
router.get("/getInventory/:classification_id", util.handleErrors(invController.getInventoryJSON));
router.get("/edit/:inventoryId", util.handleErrors(invController.buildEditVehicle));
router.get("/delete/:inventoryId", util.handleErrors(invController.buildDeleteVehicle));
router.post("/add-vehicle", 
            invValidate.inventoryRules(),
            invValidate.checkInvData,
            util.handleErrors(invController.postVehicle));
router.post("/update", 
    invValidate.inventoryRules(),
    invValidate.checkUpdateData,
    util.handleErrors(invController.updateVehicle));
router.post("/delete", util.handleErrors(invController.deleteVehicle));

module.exports = router;
