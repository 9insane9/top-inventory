const db = require("../db/queries/queries")

async function addItem(req, res) {
  if (req.errors) {
    return res.status(400).json({ errors: req.errors })
  }

  const { name, price, quantity } = req.body
  try {
    await db.addItem(name, price, quantity)
    res.status(200).json({ message: "Item saved successfully" })
  } catch (err) {
    console.error("Error adding item:", err)
    res.status(500).json({ error: err })
  }
}

async function updateItem(req, res) {
  if (req.errors) {
    return res.status(400).json({ errors: req.errors })
  }

  const { id } = req.params
  const { name, price, quantity } = req.body
  try {
    await db.updateItem(id, name, price, quantity)
    res.status(200).json({ message: "Item updated successfully" })
  } catch (err) {
    console.error("Error updating item:", err)
    res.status(500).json({ error: err })
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
