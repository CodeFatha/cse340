const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function(req, res){
  const nav = await utilities.getNav()
  res.render("index", {title: "Home", nav})
}

baseController.buildServerError = async function(req, res){
  const nav = await utilities.getNav()
  res.status(500).render("server-error", {title: "Server Error", nav})
}

baseController.build404Error = async function(req, res){
  const nav = await utilities.getNav()
  res.status(404).render("404", {title: "Error 404", nav})
}

module.exports = baseController