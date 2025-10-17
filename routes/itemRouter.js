const { Router } = require("express")
const {
  addItem,
  updateItem,
  deleteItem,
  getItemCategories,
  setItemCategories,
} = require("../controllers/itemController")

const { validateItem } = require("../validators")

const itemRouter = Router()

itemRouter.post("/new", validateItem, addItem)
itemRouter.put("/:id", validateItem, updateItem)
itemRouter.delete("/:id", deleteItem)

itemRouter.get("/:id/categories", getItemCategories)
itemRouter.put("/:id/categories", setItemCategories)

module.exports = itemRouter
