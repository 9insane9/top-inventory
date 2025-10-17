const express = require("express")
const iconRouter = express.Router()
const {
  getIcons,
  addIcon,
  deleteIcon,
} = require("../controllers/iconController")

const { validateIcon } = require("../validators")

iconRouter.get("/", getIcons)
iconRouter.post("/", validateIcon, addIcon)
iconRouter.delete("/:id", deleteIcon)

module.exports = iconRouter
