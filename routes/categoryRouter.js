const { Router } = require("express")
const categoryController = require("../controllers/categoryController")

const categoryRouter = Router()

categoryRouter.get("/", categoryController.getRenderItemList)
categoryRouter.get("/edit", categoryController.getRenderCategoryEditor)
categoryRouter.get("/:id", categoryController.getRenderItemList)
categoryRouter.get("/uncategorized", categoryController.getRenderItemList)

categoryRouter.post("/new", categoryController.addCategory)
categoryRouter.put("/:id", categoryController.updateCategory)
categoryRouter.delete("/:id", categoryController.deleteCategory)

module.exports = categoryRouter
