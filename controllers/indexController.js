const db = require("../db/queries")

module.exports = async function getProducts(req, res) {
  const itemRows = await db.getItems()
  const categoryRows = await db.getCategories()

  res.render("index", { itemRows, categoryRows })
}
