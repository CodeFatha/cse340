const jwt = require("jsonwebtoken")
const util = require('../utilities')
const accountModel = require('../models/account-model')
const bcrypt = require("bcryptjs")
require("dotenv").config()

async function buildLogin(req, res, next) {
    let nav  = await util.getNav()
    res.render("account/login", {
        title: "Login",
        nav,
        errors: null,
    })
}
async function buildRegistration(req, res, next) {
    let nav  = await util.getNav()
    res.render("account/registration", {
        title: "Registration",
        nav,
        errors: null,
    })
}

async function buildAccountEdit(req, res, next) {
    let nav  = await util.getNav()
    const name = res.locals.accountData.account_firstname
    res.render("account/edit", {
        title: "Edit " + name,
        nav,
        errors: null,
    })
}

async function buildAccountIndex(req, res, next) {
    let nav  = await util.getNav()
    res.render("account/", {
        title: "Account Management",
        nav,
        errors: null,
    })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {

    let nav = await util.getNav()
    const { account_firstname, account_lastname, account_email, account_password } = req.body

    // Hash the password before storing
    let hashedPassword
    try {
      // regular password and cost (salt is generated automatically)
      hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch (error) {
      req.flash("notice", 'Sorry, there was an error processing the registration.')
      res.status(500).render("account/registration", {
        title: "Registration",
        nav,
        errors: null,
      })
    }

    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
    )

    if (regResult) {
      req.flash(
        "notice",
        `Congratulations, you\'re registered ${account_firstname}. Please log in.`
      )
      res.status(201).render("account/login", {
        title: "Login",
        nav,
        errors: null
      })
    } else {
      req.flash("notice", "Sorry, the registration failed.")
      res.status(501).render("account/registration", {
        title: "Registration",
        nav,
      })
    }
}

async function accountLogin(req, res) {
  let nav = await util.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/")
    }
    else {
      req.flash("message notice", "The password you entered is incorrect")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}

async function updateAccount(req, res) {
  try {
  let nav = await util.getNav()
  const { account_firstname, account_lastname, account_email } = req.body 
  const account_id = res.locals.accountData.account_id
  const updateResult = await accountModel.updateAccount(
    account_id,
    account_firstname,
    account_lastname,
    account_email,
  )
  if (updateResult) {
    const accountData = await accountModel.getAccountByEmail(account_email)
    res.locals.accountData = accountData
    delete accountData.account_password
    const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
    res.status(200).render("account/", {
      title: "Account Management",
      nav,
      errors: null,
    })
  }
  } catch (error) {
    console.error(error)
    req.flash("notice", "Sorry, the update failed.")
    res.status(501).render("account/edit", {
      title: "Edit Account",
      nav,
      errors: null,
    })
  }
}

async function accountLogout(req, res) {
  let nav = await util.getNav()
  res.clearCookie("jwt")  
  res.locals.loggedin = false
  res.locals.accountData = null
  req.flash("notice", "You have been logged out.")
  res.status(200).render("account/login", {
    title: "Login",
    nav,
    errors: null,
  })
}

module.exports = { buildLogin, buildRegistration, buildAccountIndex, registerAccount, accountLogin, accountLogout, buildAccountEdit, updateAccount }