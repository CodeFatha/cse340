const express = require("express")
const router = new express.Router() 
const util = require("../utilities")
const accController = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation')

// Route to build login view
router.get("/login", util.handleErrors(accController.buildLogin));
router.get("/registration", util.handleErrors(accController.buildRegistration));
router.post('/register',         
        regValidate.registationRules(),
        regValidate.checkRegData,
        util.handleErrors(accController.registerAccount)
);
router.post(
  "/login",
  (req, res) => {
    res.status(200).send('login process')
  }
)

module.exports = router;
