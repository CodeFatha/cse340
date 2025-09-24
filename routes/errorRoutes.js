const express = require("express")
const router = new express.Router() 
const baseController = require("../controllers/baseController")

// Route to build inventory by classification view
router.get("/server", baseController.buildServerError);
router.get("/404", baseController.build404Error);

module.exports = router;