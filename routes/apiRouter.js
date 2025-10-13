const { Router } = require("express")
const { getCategory, getItem } = require("../controllers/apiController")

const apiRouter = Router()

apiRouter.get("/categories/:id", getCategory)
apiRouter.get("/items/:id", getItem)

module.exports = apiRouter
