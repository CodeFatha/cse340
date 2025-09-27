/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const session = require("express-session")
const pool = require('./database/')
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const static = require("./routes/static")
const inventory = require("./routes/inventoryRoute")
const classification = require("./routes/classificationRoute")
const errorRoutes = require("./routes/errorRoutes")
const accountRoute = require("./routes/accountRoute")
const baseController = require("./controllers/baseController")
const utilities = require("./utilities")
const app = express()


/* ***********************
 * View engine and templates
 *************************/

app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout")

/* ***********************
 * Middleware
 * ************************/
 app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))

app.use(express.urlencoded({ extended: true }))
// Express Messages Middleware
app.use(require('connect-flash')())
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res)
  next()
})
/* ***********************
 * Routes
 *************************/
app.use(static)

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
// Index route
app.get("/", baseController.buildHome)
//Inventory route
app.use("/inv", inventory)
app.use("/error", errorRoutes)
app.use("/account", accountRoute)
app.use("/classification", classification)
app.use(async (req, res) => {
  const nav = await utilities.getNav()
  res.status(404).render("404", { title: "Error 404" , nav})
})

app.use((err, req, res, next) => {
  console.error("Server Error:", err.stack)
  res.status(500).render("server-error", { title: "Server Error" })
})