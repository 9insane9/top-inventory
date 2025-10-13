const pool = require("../db/pool")

async function getItemsByCategory(categoryId) {
  let query
  let values = []

  if (categoryId === null) {
    // no categories
    query = `
      SELECT i.*
      FROM items i
      LEFT JOIN item_categories ic ON i.id = ic.item_id
      WHERE ic.category_id IS NULL
      ORDER BY id ASC
    `
  } else if (categoryId) {
    // specific category
    query = `
      SELECT i.*
      FROM items i
      JOIN item_categories ic ON i.id = ic.item_id
      WHERE ic.category_id = $1
      ORDER BY id ASC
    `
    values = [categoryId]
  } else {
    // all items
    query = "SELECT * FROM items ORDER BY id ASC"
  }

  const { rows } = await pool.query(query, values)
  return rows
}

async function getCategories() {
  const { rows } = await pool.query("SELECT * FROM categories ORDER BY id ASC")
  return rows
}

async function addCategory(name) {
  await pool.query("INSERT INTO categories (name) VALUES ($1)", [name])
}

async function updateCategory(id, name) {
  await pool.query("UPDATE categories SET name = $1 WHERE id = $2", [name, id])
}

async function deleteCategory(id) {
  await pool.query("DELETE FROM categories WHERE id = $1", [id])
}

async function addItem(name, price, quantity) {
  await pool.query(
    "INSERT INTO items (name, price, quantity) VALUES ($1, $2, $3)",
    [name, price, quantity]
  )
}

async function updateItem(id, name, price, quantity) {
  await pool.query(
    "UPDATE items SET name = $1, price = $2, quantity = $3 WHERE id = $4",
    [name, price, quantity, id]
  )
}

async function deleteItem(id) {
  await pool.query("DELETE FROM items WHERE id = $1", [id])
}

module.exports = {
  getItemsByCategory,
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
  addItem,
  updateItem,
  deleteItem,
}
