const express = require("express")
const router = new express.Router() 
const util = require("../utilities")
const accController = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation')

// Route to build login view
router.get("/login", util.handleErrors(accController.buildLogin));
router.get("/", util.checkLogin, util.handleErrors(accController.buildAccountIndex));
router.get("/registration", util.handleErrors(accController.buildRegistration));
router.get("/logout", util.handleErrors(accController.accountLogout));
router.get("/edit", util.handleErrors(accController.buildAccountEdit));
router.post("/update", util.handleErrors(accController.updateAccount));
router.post('/register',         
        regValidate.registationRules(),
        regValidate.checkRegData,
        util.handleErrors(accController.registerAccount)
);
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  util.handleErrors(accController.accountLogin)
)

module.exports = router;
