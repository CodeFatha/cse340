/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const static = require("./routes/static")
const inventory = require("./routes/inventoryRoute")
const errorRoutes = require("./routes/errorRoutes")
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
app.use(async (req, res) => {
  const nav = await utilities.getNav()
  res.status(404).render("404", { title: "Error 404" , nav})
})
