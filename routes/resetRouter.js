const express = require("express")
const resetDb = require("../db/resetDb")

const resetRouter = express.Router()

resetRouter.post("/", async (req, res) => {
  ///remove 'false' flag for production
  await resetDb(false)
  console.log("Db reset!")
  res.redirect("/categories")
})

module.exports = resetRouter
