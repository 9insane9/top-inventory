const db = require("../db/queries/queries")
const { validateCategory, validateItem } = require("../validators")

async function getRenderItemList(req, res) {
  let categoryId

  if (req.params.id === "uncategorized") {
    categoryId = null
  } else if (req.params.id) {
    categoryId = Number(req.params.id)
  } else {
    categoryId = undefined
  }

  const itemRows = await db.getItemsByCategory(categoryId)
  const categoryRows = await db.getCategories()

  res.render("index", { itemRows, categoryRows, categoryId, errors: null })
}

async function getRenderCategoryEditor(req, res) {
  const categoryRows = await db.getCategories()

  res.render("categoryEdit", { categoryRows, errors: null })
}

async function addCategory(req, res) {
  try {
    const errors = req.errors
    if (errors) {
      return res.status(400).json({ errors })
    }

    const { name, icon_id } = req.body
    await db.addCategory(name, icon_id)
    res.status(201).json({ message: "Category added successfully" })
  } catch (err) {
    console.error("Error adding category:", err)
    res.status(500).json({ error: "Error adding category" })
  }
}

async function updateCategory(req, res) {
  try {
    const errors = req.errors
    if (errors) {
      return res.status(400).json({ errors })
    }

    const { name, icon_id } = req.body
    const { id } = req.params
    await db.updateCategory(id, name, icon_id)
    res.json({ message: "Category updated successfully" })
  } catch (err) {
    console.error("Error updating category:", err)
    res.status(500).json({ error: "Error updating category" })
  }
}

async function deleteCategory(req, res) {
  try {
    const { id } = req.params
    await db.deleteCategory(id)
    res.sendStatus(200)
  } catch (err) {
    console.error("Error deleting category:", err)
    res.status(500).send("Error deleting category")
  }
}

module.exports = {
  getRenderItemList,
  getRenderCategoryEditor,
  addCategory,
  updateCategory,
  deleteCategory,
}
