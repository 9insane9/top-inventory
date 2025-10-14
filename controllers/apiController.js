const db = require("../db/queries/queries")

async function getCategory(req, res) {
  try {
    const id = req.params.id
    const category = await db.getCategoryById(id)
    if (!category) return res.status(404).json({ error: "Category not found" })
    res.json(category)
  } catch (err) {
    console.error("Error fetching category:", err)
    res.status(500).json({ error: "Internal server error" })
  }
}

async function getItem(req, res) {
  try {
    const id = req.params.id
    const item = await db.getItemById(id)
    if (!item) return res.status(404).json({ error: "Item not found" })
    res.json(item)
  } catch (err) {
    console.error("Error fetching item:", err)
    res.status(500).json({ error: "Internal server error" })
  }
}

module.exports = { getCategory, getItem }
