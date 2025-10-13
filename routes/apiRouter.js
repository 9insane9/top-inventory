const { Router } = require("express")
const apiController = require("../controllers/apiController")

const apiRouter = Router()

apiRouter.get("/categories/:id", apiController.getCategory)
apiRouter.get("/items/:id", apiController.getItem)

module.exports = apiRouter
