const { Router } = require("express")
const categoryController = require("../controllers/categoryController")

const categoryRouter = Router()

categoryRouter.get("/", categoryController.getItems)
categoryRouter.get("/:id", categoryController.getItems)
categoryRouter.get("/uncategorized", categoryController.getItems)

module.exports = categoryRouter
