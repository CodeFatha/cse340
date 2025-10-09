const pool = require("../database")

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

async function getInventoryById(inventory_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.inv_id = $1`,
      [inventory_id]
    )
    return data.rows[0]
  } catch (error) {
    console.error("getInventoryById error " + error)
  }
}

async function insertVehicle(inv_make, inv_model, inv_description, inv_year, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, inv_condition, classification_id) {
  if (!inv_image) {
    inv_image = '/images/vehicles/no-image.png'
  }
  if (!inv_thumbnail) {
    inv_thumbnail = '/images/vehicles/no-image-tn.png'
  }
  try {
    const sql = "INSERT INTO inventory (inv_make, inv_model, inv_description, inv_year, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, inv_condition, classification_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *"
    return await pool.query(sql, [inv_make, inv_model, inv_description, inv_year, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, inv_condition, classification_id])
  } catch (error) {
    return error.message
  }
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
async function updateVehicle(
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
) {
  try {
    const sql =
      "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9,  inv_condition = $10, classification_id = $11 WHERE inv_id = $12 RETURNING *"
    const data = await pool.query(sql, [
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
      inv_id
    ])
    return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}

async function deleteVehicle(inv_id) {
  try {
    const sql =
      "DELETE FROM public.inventory WHERE inv_id = $1 RETURNING *"

    return await pool.query(sql, [inv_id])

  } catch (error) {
    console.error("Delete vehicle error: " + error)
  }
}

module.exports = {  getInventoryByClassificationId, getInventoryById, insertVehicle, updateVehicle, deleteVehicle }