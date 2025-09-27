const invModel = require("../models/inventory-model")
const classModel = require("../models/classification-model")
const Util = {}

/* ****************************************
* Middleware to handle async route errors
* **************************************** */
Util.handleErrors = function(controller) {
  return async (req, res, next) => {
    try {
      await controller(req, res, next)
    } catch (err) {
      console.error("Route error:", err)
      next(err)
    }
  }
}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await classModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li class="card">'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

Util.buildDetailView = async function (data) {
  let grid
  grid = '<h2>' + data.inv_year + ' ' + data.inv_make + ' ' + data.inv_model + '</h2>'
  grid += '<div class="container">'
  grid += '<div class="image">'
  grid += '<img src="' + data.inv_image + '" alt="Image of ' + data.inv_image + ' ' + data.inv_model + '" /> </div>'
  grid += '<div class="info">'
  grid += '<h2>' + data.inv_make + ' ' + data.inv_model + ' Details</h2>'
  grid += '<p class="bg-highlight"><span>Price</span>: $' + new Intl.NumberFormat('en-US').format(data.inv_price) + '</p>'
  grid += '<p><span>Description</span>: ' + data.inv_description + '</p>'
  grid += '<p class="bg-highlight"><span>Color</span>: ' + data.inv_color + '</p>'
  grid += '<p><span>Miles</span>: ' + new Intl.NumberFormat('en-US').format(data.inv_miles) + '</p>'
  grid += '</div>'
  grid += '</div>'

  return grid
}

module.exports = Util
