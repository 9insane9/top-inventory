const express = require("express")
const iconRouter = express.Router()
const {
  getIcons,
  addIcon,
  deleteIcon,
} = require("../controllers/iconController")

iconRouter.get("/", getIcons)
iconRouter.post("/", addIcon)
iconRouter.delete("/:id", deleteIcon)

module.exports = iconRouter
