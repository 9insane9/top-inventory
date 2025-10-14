const express = require("express")
const router = express.Router()
const { getCategoryIcons } = require("../db/queries/icons")

// GET all icons
router.get("/", async (req, res) => {
  try {
    const icons = await getCategoryIcons()
    res.json(icons)
  } catch (err) {
    console.error("Failed to fetch icons:", err)
    res.status(500).json({ error: "Failed to fetch icons" })
  }
})

module.exports = router
