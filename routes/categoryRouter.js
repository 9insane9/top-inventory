const { Router } = require("express")
const {
  getRenderItemList,
  getRenderCategoryEditor,
  addCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController")

const { validateCategory } = require("../validators")

const categoryRouter = Router()

categoryRouter.get("/", getRenderItemList)
categoryRouter.get("/edit", getRenderCategoryEditor)
categoryRouter.get("/:id", getRenderItemList)
categoryRouter.get("/uncategorized", getRenderItemList)

categoryRouter.post("/new", validateCategory, addCategory)
categoryRouter.put("/:id", validateCategory, updateCategory)
categoryRouter.delete("/:id", deleteCategory)

module.exports = categoryRouter
