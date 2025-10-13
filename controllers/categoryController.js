const db = require("../db/queries")

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

  res.render("index", { itemRows, categoryRows, categoryId })
}

async function getRenderCategoryEditor(req, res) {
  const categoryRows = await db.getCategories()

  res.render("categoryEdit", { categoryRows })
}

async function addCategory(req, res) {
  try {
    const { name } = req.body
    await db.addCategory(name)
    res.sendStatus(200)
  } catch (err) {
    console.error("Error adding category:", err)
    res.status(500).send("Error adding category")
  }
}

async function updateCategory(req, res) {
  try {
    const { name } = req.body
    const { id } = req.params
    await db.updateCategory(id, name)
    res.sendStatus(200)
  } catch (err) {
    console.error("Error updating category:", err)
    res.status(500).send("Error updating category")
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
