const pool = require("../db/pool")

async function getItems() {
  const { rows } = await pool.query("SELECT * FROM items")
  return rows
}

async function getCategories() {
  const { rows } = await pool.query("SELECT * FROM categories")
  return rows
}

module.exports = {
  getItems,
  getCategories,
}
