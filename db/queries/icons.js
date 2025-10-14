const pool = require("../pool")

async function getCategoryIcons() {
  const { rows } = await pool.query("SELECT * FROM icons ORDER BY id ASC")
  return rows
}

async function addCategoryIcon(svg) {
  await pool.query("INSERT INTO icons (svg) VALUES ($1)", [svg])
}

async function deleteCategoryIcon(iconId) {
  await pool.query("DELETE FROM icons WHERE id = $1", [iconId])
}

module.exports = { getCategoryIcons, addCategoryIcon, deleteCategoryIcon }
