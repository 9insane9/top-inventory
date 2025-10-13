const db = require("../db/queries")

async function addItem(req, res) {
  const { name, price, quantity } = req.body
  try {
    await db.addItem(name, price, quantity)
    res.sendStatus(200)
  } catch (err) {
    console.error("Error adding item:", err)
    res.sendStatus(500)
  }
}

async function updateItem(req, res) {
  const { id } = req.params
  const { name, price, quantity } = req.body
  try {
    await db.updateItem(id, name, price, quantity)
    res.sendStatus(200)
  } catch (err) {
    console.error("Error updating item:", err)
    res.sendStatus(500)
  }
}

async function deleteItem(req, res) {
  const { id } = req.params
  try {
    await db.deleteItem(id)
    res.sendStatus(200)
  } catch (err) {
    console.error("Error deleting item:", err)
    res.sendStatus(500)
  }
}

// item categories

async function getItemCategories(req, res) {
  const { id } = req.params
  try {
    const categories = await db.getCategoriesForItem(id)
    res.json(categories)
  } catch (err) {
    console.error("Error fetching item categories:", err)
    res.status(500).json({ error: "Failed to fetch categories" })
  }
}

async function setItemCategories(req, res) {
  const { id } = req.params
  const { categoryIds } = req.body
  try {
    await db.setCategoriesForItem(id, categoryIds)
    res.json({ success: true })
  } catch (err) {
    console.error("Error setting item categories:", err)
    res.status(500).json({ error: "Failed to update categories" })
  }
}

module.exports = {
  addItem,
  updateItem,
  deleteItem,
  getItemCategories,
  setItemCategories,
}
