const { Router } = require("express")
const {
  addItem,
  updateItem,
  deleteItem,
  getItemCategories,
  setItemCategories,
} = require("../controllers/itemController")

const itemRouter = Router()

itemRouter.post("/new", addItem)
itemRouter.put("/:id", updateItem)
itemRouter.delete("/:id", deleteItem)

itemRouter.get("/:id/categories", getItemCategories)
itemRouter.put("/:id/categories", setItemCategories)

module.exports = itemRouter
