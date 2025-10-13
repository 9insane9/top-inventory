const { Router } = require("express")
const itemController = require("../controllers/itemController")

const itemRouter = Router()

itemRouter.post("/new", itemController.addItem)

itemRouter.put("/:id", itemController.updateItem)

itemRouter.delete("/:id", itemController.deleteItem)

module.exports = itemRouter
