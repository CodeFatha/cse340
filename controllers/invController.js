const invModel = require("../models/inventory-model")
const classModel = require("../models/classification-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./classifications/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

invCont.buildByInventoryId = async function (req, res, next) {
  const inventory_id = req.params.inventoryId
  const data = await invModel.getInventoryById(inventory_id)
  const view = await utilities.buildDetailView(data)
  const nav = await utilities.getNav()
  res.render("./inventory/detail", {
    title: data.inv_make + " " + data.inv_model,
    nav,
    view,
  })
}

invCont.buildInventoryIndex = async function (req, res, next) {
  const nav = await utilities.getNav()
  res.render("./inventory/index", {
    title: "Vehicle Management",
    nav,    
  })
}


invCont.buildAddVehicle = async function (req, res, next) {
  const nav = await utilities.getNav()
  const classifications = await classModel.getClassifications()
  res.render("./inventory/add-vehicle", {
    title: "Add Vehicle",
    nav, 
    errors: null,
    classifications,
  })
}

invCont.postVehicle = async function (req, res, next) {
  const nav = await utilities.getNav()
  const { inv_make, inv_model, inv_description, inv_year, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body  
  const regResult = await invModel.insertVehicle(
       inv_make, 
       inv_model, 
       inv_description, 
       inv_year, 
       inv_image, 
       inv_thumbnail, 
       inv_price, 
       inv_miles, 
       inv_color, 
       classification_id
  )    
  if (regResult) {
        req.flash(
          "notice",
          `Congratulations, you\'ve added a ${inv_year} ${inv_make} ${inv_model}`
        )
        res.redirect(req.originalUrl)
      } else {
        req.flash("notice", "Sorry, adding a vehicle failed.")
        res.status(501).render("inv/add-vehicle", {
          title: "Add Vehicle",
          nav,
        })
      }
}

module.exports = invCont