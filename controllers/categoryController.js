const db = require("../db/queries")

async function getItems(req, res) {
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

  res.render("index", { itemRows, categoryRows })
}

module.exports = {
  getItems,
}
