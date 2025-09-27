const classModel = require("../models/classification-model")
const utilities = require("../utilities/")

const classCont = {}

classCont.buildAddClassification = async function (req, res, next) {
    const nav = await utilities.getNav()
    res.render("./classifications/add-classification", {
      title: "Add Classification",
      nav,
      errors: null,
    })
}

classCont.postClassification = async function (req, res, next) {
  const nav = await utilities.getNav()
  const { classification_name } = req.body
  const regResult = await classModel.insertClassification(classification_name)
  if (regResult) {
        req.flash(
          "notice",
          `Classification successfully added.`
        )
        res.status(201).render("index", {
          title: "Home",
          nav,
        })
      } else {
        req.flash("notice", "Sorry, adding a classification failed.")
        res.status(501).render("inv/add-classification", {
          title: "Add Classification",
          nav,
        })
      }
}

module.exports = classCont