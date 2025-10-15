const {
  getCategoryIcons,
  addCategoryIcon,
  deleteCategoryIcon,
} = require("../db/queries/icons")

async function getIcons(req, res) {
  try {
    const icons = await getCategoryIcons()
    res.json(icons)
  } catch (err) {
    console.error("Failed to fetch icons:", err)
    res.status(500).json({ error: "Failed to fetch icons" })
  }
}

async function addIcon(req, res) {
  try {
    const { svg } = req.body

    if (!svg) {
      return res.status(400).json({ error: "SVG data is required" })
    }

    await addCategoryIcon(svg)
    res.status(201).json({ message: "Icon added successfully" })
  } catch (err) {
    console.error("Failed to add icon:", err)
    res.status(500).json({ error: "Failed to add icon" })
  }
}

async function deleteIcon(req, res) {
  try {
    const { id } = req.params

    if (!id) {
      return res.status(400).json({ error: "Icon ID is required" })
    }

    await deleteCategoryIcon(id)
    res.json({ message: "Icon deleted successfully" })
  } catch (err) {
    console.error("Failed to delete icon:", err)
    res.status(500).json({ error: "Failed to delete icon" })
  }
}

module.exports = { getIcons, addIcon, deleteIcon }
