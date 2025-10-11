const pool = require("../db/pool")

async function getItemsByCategory(categoryId) {
  let query
  let values = []

  if (categoryId === null) {
    // No categories
    query = `
      SELECT i.*
      FROM items i
      LEFT JOIN item_categories ic ON i.id = ic.item_id
      WHERE ic.category_id IS NULL
    `
  } else if (categoryId) {
    // Specific category
    query = `
      SELECT i.*
      FROM items i
      JOIN item_categories ic ON i.id = ic.item_id
      WHERE ic.category_id = $1
    `
    values = [categoryId]
  } else {
    // All items
    query = "SELECT * FROM items"
  }

  const { rows } = await pool.query(query, values)
  return rows
}

async function getCategories() {
  const { rows } = await pool.query("SELECT * FROM categories")
  return rows
}

module.exports = {
  getItemsByCategory,
  getCategories,
}
