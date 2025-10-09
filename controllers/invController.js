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
  const list = await utilities.buildClassificationList()
  res.render("./inventory/index", {
    title: "Vehicle Management",
    nav,    
    list,
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

invCont.buildEditVehicle = async function (req, res, next) {
  const nav = await utilities.getNav()
  const classificationSelect = await utilities.buildClassificationList()
  const classifications = await classModel.getClassifications()
  const inv_id = parseInt(req.params.inventoryId)
  const vehicle = await invModel.getInventoryById(inv_id)
  const vehicle_name = `${vehicle.inv_make} ${vehicle.inv_model}`
  const classification = await classModel.getClassificationById(vehicle.classification_id)
  res.render("./inventory/edit-vehicle", {
   title: "Edit " + vehicle_name,
    nav,
    classificationSelect: classificationSelect,
    classifications,
    errors: null,
    inv_id: vehicle.inv_id,
    inv_make: vehicle.inv_make,
    inv_model: vehicle.inv_model,
    inv_year: vehicle.inv_year,
    inv_description: vehicle.inv_description,
    inv_image: vehicle.inv_image,
    inv_thumbnail: vehicle.inv_thumbnail,
    inv_price: vehicle.inv_price,
    inv_miles: vehicle.inv_miles,
    inv_color: vehicle.inv_color,
    inv_condition: vehicle.inv_condition,
    inv_cl: classification,
  })
}

invCont.buildDeleteVehicle = async function (req, res, next) {
  const nav = await utilities.getNav()
  const inv_id = parseInt(req.params.inventoryId)
  const vehicle = await invModel.getInventoryById(inv_id)
  const vehicle_name = `${vehicle.inv_make} ${vehicle.inv_model}`
  res.render("./inventory/delete-vehicle", {
   title: "Delete " + vehicle_name,
    nav,
    errors: null,
    inv_id: vehicle.inv_id,
    inv_make: vehicle.inv_make,
    inv_model: vehicle.inv_model,
    inv_year: vehicle.inv_year,
    inv_price: vehicle.inv_price,
  })
}

invCont.postVehicle = async function (req, res, next) {
  const nav = await utilities.getNav()
  const { inv_make, inv_model, inv_description, inv_year, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, inv_condition, classification_id } = req.body  
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
       inv_condition,
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

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateVehicle = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    inv_condition,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateVehicle(
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    inv_condition,
    classification_id,
    inv_id,  
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const inv_cl = await classModel.getClassificationById(classification_id)
    const classifications = await classModel.getClassifications()
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the update failed.")
    res.status(501).render("inventory/edit-vehicle", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    inv_condition,
    inv_cl,
    classification_id,
    classifications
    })
  }
}
invCont.deleteVehicle = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {inv_id, inv_make, inv_model, inv_year, inv_price } = req.body
  const deleteResult = await invModel.deleteVehicle(inv_id)

  if (deleteResult) {
    const itemName = deleteResult.inv_make + " " + deleteResult.inv_model
    req.flash("notice", `The ${itemName} was successfully deleted.`)
    res.redirect("/inv/")
  } else {
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the delete failed.")
    res.status(501).render("inventory/delete-vehicle", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_price,
    })
  }
}

invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

module.exports = invCont