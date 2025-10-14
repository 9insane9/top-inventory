const pool = require("../pool")

//single entries
async function getCategoryById(id) {
  const result = await pool.query("SELECT * FROM categories WHERE id = $1", [
    id,
  ])
  return result.rows[0]
}

async function getItemById(id) {
  const result = await pool.query("SELECT * FROM items WHERE id = $1", [id])
  return result.rows[0]
}

// lists
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
  const query1 = `SELECT * FROM categories ORDER BY id ASC`

  const query2 = `
    SELECT 
      c.id,
      c.name,
      i.svg AS icon_svg
    FROM categories c
    LEFT JOIN icons i ON c.icon_id = i.id
    ORDER BY c.id ASC;
  `

  const { rows } = await pool.query(query2)
  return rows
}

// categories
async function addCategory(name, icon_id) {
  await pool.query("INSERT INTO categories (name, icon_id) VALUES ($1, $2)", [
    name,
    icon_id,
  ])
}

async function updateCategory(id, name, icon_id) {
  await pool.query(
    "UPDATE categories SET name = $1, icon_id = $2 WHERE id = $3",
    [name, icon_id, id]
  )
}

async function deleteCategory(id) {
  await pool.query("DELETE FROM categories WHERE id = $1", [id])
}

// items
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

// item categories
async function getCategoriesForItem(itemId) {
  const query = `
    SELECT c.id, c.name
    FROM categories c
    JOIN item_categories ic ON c.id = ic.category_id
    WHERE ic.item_id = $1
  `
  const { rows } = await pool.query(query, [itemId])
  return rows
}

async function setCategoriesForItem(itemId, categoryIds = []) {
  const client = await pool.connect()
  try {
    await client.query("BEGIN")

    await client.query("DELETE FROM item_categories WHERE item_id = $1", [
      itemId,
    ])

    if (categoryIds.length) {
      const insertValues = categoryIds
        .map((id, index) => `($1, $${index + 2})`)
        .join(", ")
      await client.query(
        `INSERT INTO item_categories (item_id, category_id) VALUES ${insertValues}`,
        [itemId, ...categoryIds]
      )
    }

    await client.query("COMMIT")
  } catch (err) {
    await client.query("ROLLBACK")
    throw err
  } finally {
    client.release()
  }
}

module.exports = {
  getCategoryById,
  getItemById,
  getItemsByCategory,
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
  addItem,
  updateItem,
  deleteItem,
  getCategoriesForItem,
  setCategoriesForItem,
}
